pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '10')) // Keep only the last 10 builds
    }
    environment {
        NEXEA_GCP_PROJECT_ID = 'my-project-nexea'
        NEXEA_GCP_INSTANCE_ID = 'nexea-event-app'
        DOCKER_IMAGE_NAME = 'nexea-event-app'
        NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL_ID = 'NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL'
        NEXEA_EVENTAPP_SSH_CREDENTIAL_ID = 'NEXEA_EVENTAPP_SSH_CREDENTIAL'
        NEXEA_EVENTAPP_SERVICEACCOUNT_KEYFILE = 'NEXEA_EventApp_ServiceAccount_Keyfile.json'
    }
    stages {
        stage('Checkout Repositories') {
            parallel {
                stage('Checkout Frontend Repository') {
                    steps {
                        echo 'Checking out Frontend Repository...'
                        dir('frontend') {
                            git url: 'https://github.com/NxTech4021/nexea-frontend.git', branch: 'main'
                        }
                        echo 'Checked out frontend repository'
                        sh 'ls -al frontend'
                    }
                }
                stage('Checkout Backend Repository') {
                    steps {
                        echo 'Checking out Backend Repository...'
                        dir('backend') {
                            git url: 'https://github.com/NxTech4021/nexea-backend.git', branch: 'main'
                        }
                        echo 'Checked out backend repository'
                        sh 'ls -al backend'
                    }
                }
            }
        }
        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend Docker Image') {
                    steps {
                        echo 'Building Frontend Docker Image...'
                        dir('frontend') {
                            script {
                                sh 'ls -al'
                                dockerImageFrontend = docker.build("${DOCKER_IMAGE_NAME}-frontend", ".")
                            }
                        }
                    }
                }
                stage('Build Backend Docker Image') {
                    steps {
                        echo 'Building Backend Docker Image...'
                        dir('backend') {
                            script {
                                sh 'ls -al'
                                dockerImageBackend = docker.build("${DOCKER_IMAGE_NAME}-backend", ".")
                            }
                        }
                    }
                }
            }
        }
        stage('Push Docker Images') {
            parallel {
                stage('Push Frontend Docker Image') {
                    when {
                        expression { return dockerImageFrontend != null }
                    }
                    steps {
                        echo 'Pushing Frontend Docker Image...'
                        script {
                            withCredentials([file(credentialsId: 'NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL', variable: 'NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL_ID')]) {
                                sh '''
                                  cat $NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL_ID | docker login -u _json_key --password-stdin https://gcr.io
                                  docker tag ${DOCKER_IMAGE_NAME}-frontend:latest gcr.io/${NEXEA_GCP_PROJECT_ID}/${DOCKER_IMAGE_NAME}-frontend:latest
                                  docker push gcr.io/${NEXEA_GCP_PROJECT_ID}/${DOCKER_IMAGE_NAME}-frontend:latest
                                '''
                            }
                        }
                    }
                }
                stage('Push Backend Docker Image') {
                    when {
                        expression { return dockerImageBackend != null }
                    }
                    steps {
                        echo 'Pushing Backend Docker Image...'
                        script {
                            withCredentials([file(credentialsId: 'NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL', variable: 'NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL_ID')]) {
                                sh '''
                                  cat $NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL_ID | docker login -u _json_key --password-stdin https://gcr.io
                                  docker tag ${DOCKER_IMAGE_NAME}-backend:latest gcr.io/${NEXEA_GCP_PROJECT_ID}/${DOCKER_IMAGE_NAME}-backend:latest
                                  docker push gcr.io/${NEXEA_GCP_PROJECT_ID}/${DOCKER_IMAGE_NAME}-backend:latest
                                '''
                            }
                        }
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                sshagent([NEXEA_EVENTAPP_SSH_CREDENTIAL_ID]) {
                    script {
                        sh '''
                        ssh -o StrictHostKeyChecking=no famintech@$NEXEA_GCP_INSTANCE_ID                       
                        # Authenticate with Google Cloud and pull Docker images
                        pwd
                        cd ~
                        gcloud auth activate-service-account --key-file=$NEXEA_EVENTAPP_SERVICEACCOUNT_KEYFILE
                        gcloud auth configure-docker
                        docker pull gcr.io/${NEXEA_GCP_PROJECT_ID}/${DOCKER_IMAGE_NAME}-frontend:latest
                        docker pull gcr.io/${NEXEA_GCP_PROJECT_ID}/${DOCKER_IMAGE_NAME}-backend:latest
                        # Restart Docker services using Docker Compose
                        docker compose down
                        docker compose up -d
                        '''
                    }
                }
            }
        }
    }
    post {
        always {
            echo 'Cleaning Workspace...'
            cleanWs()
        }
    }
}
