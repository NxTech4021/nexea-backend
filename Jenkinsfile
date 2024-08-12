pipeline {
    agent any
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
                    }
                }
                stage('Checkout Backend Repository') {
                    steps {
                        echo 'Checking out Backend Repository...'
                        dir('backend') {
                            git url: 'https://github.com/NxTech4021/nexea-backend.git', branch: 'main'
                        }
                    }
                }
            }
        }
        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend Docker Image...') {
                    steps {
                        echo 'Building Frontend Docker Image...'
                        dir('frontend') {
                            script {
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
                    steps {
                        echo 'Pushing Frontend Docker Image...'
                        script {
                            withCredentials([file(credentialsId: 'NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL', variable: 'NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL_ID')]) {
                                sh """
                                  cat $NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL_ID | docker login -u _json_key --password-stdin https://gcr.io
                                  docker tag ${DOCKER_IMAGE_NAME}-frontend:latest gcr.io/${NEXEA_GCP_PROJECT_ID}/${DOCKER_IMAGE_NAME}-frontend:latest
                                  docker push gcr.io/${NEXEA_GCP_PROJECT_ID}/${DOCKER_IMAGE_NAME}-frontend:latest
                                """
                            }
                        }
                    }
                }
                stage('Push Backend Docker Image') {
                    steps {
                        echo 'Pushing Backend Docker Image...'
                        script {
                            withCredentials([file(credentialsId: 'NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL', variable: 'NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL_ID')]) {
                                sh """
                                  cat $NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL_ID | docker login -u _json_key --password-stdin https://gcr.io
                                  docker tag ${DOCKER_IMAGE_NAME}-backend:latest gcr.io/${NEXEA_GCP_PROJECT_ID}/${DOCKER_IMAGE_NAME}-backend:latest
                                  docker push gcr.io/${NEXEA_GCP_PROJECT_ID}/${DOCKER_IMAGE_NAME}-backend:latest
                                """
                            }
                        }
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
