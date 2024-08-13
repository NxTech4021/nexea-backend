pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '10')) // Keep only last 10 builds
    }
    environment {
        NEXEA_GCP_PROJECT_ID = 'my-project-nexea'
        NEXEA_GCP_INSTANCE_ID = 'nexea-event-app'
        DOCKER_IMAGE_NAME = 'nexea-event-app'
        NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL_ID = 'NEXEA_JENKINS_SERVICEACCOUNT_CREDENTIAL'
        NEXEA_EVENTAPP_SSH_CREDENTIAL_ID = 'NEXEA_EVENTAPP_SSH_CREDENTIAL'
        NEXEA_EVENTAPP_SERVICEACCOUNT_KEYFILE = 'NEXEA_EventApp_ServiceAccount_Keyfile.json'
        DOCKER_BUILDKIT = '1' // Enable Docker BuildKit
    }
    stages {
        // Print environment variables for debugging
        stage('Print Environment') {
            steps {
                sh 'env'
            }
        }
        stage('Initialize Docker Buildx') {
            steps {
                // Debugging steps to investigate Docker configuration
                sh '''
                    echo "Debugging Docker Configuration"
                    docker version
                    docker info
                '''
                // Debugging the Docker Buildx commands
                sh '''
                    echo "Creating and Using Docker Buildx Builder"
                    docker buildx create --name mybuilder
                    docker buildx use mybuilder
                    docker buildx inspect --bootstrap
                    docker buildx ls
                '''
            }
        }
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
                        echo 'Building Frontend Docker Image with Buildx...'
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
                        echo 'Building Backend Docker Image with Buildx...'
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
    }
    post {
        always {
            echo 'Cleaning Workspace...'
            cleanWs()
        }
    }
}
