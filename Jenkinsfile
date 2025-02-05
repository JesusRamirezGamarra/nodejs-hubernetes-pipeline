pipeline {
    agent none

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_REPO = 'jesusramirezgamarra/jenkins-node'
        KUBE_DEPLOYMENT_NAME='mi-app-JesusRamirez'
    }

    stages {
        stage('Instalar dependencias...') {
            agent {
                docker {
                    image 'node:18-alpine'
                }
            }
            steps {
                echo 'Listando todas las carpetas y archivos...'
                sh 'npm install'
            }
        }

        stage('Ejecutar tests...') {
            agent {
                docker {
                    image 'node:18-alpine'
                }
            }
            steps {
                echo 'Listando todas las carpetas y archivos...'
                sh 'npm run test'
            }
        }

        stage('Construir y pushear imagen a dockerhub') {
            when {
                branch 'develop'
            }

            agent {
                docker {
                    image 'docker:latest'
                }
            }
            steps {
                sh '''
                echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                docker build -t $DOCKER_REPO:latest .
                docker push $DOCKER_REPO:latest
                '''
            }
        }

        stage('Despliegue inicial en minikube...') {
            when {
                branch 'develop'
            }
            agent {
                docker { 
                    image 'bitnami/kubectl:latest'
                    args '--entrypoint=""'
                }
            }
            steps {
                withKubeConfig([credentialsId: 'minikube-kubeconfig']) {
                    script {
                        def deploymentExists = sh(script: "kubectl get deployment $KUBE_DEPLOYMENT_NAME --ignore-not-found", returnStdout: true).trim()
                        if (deploymentExists) {
                            echo "El deployment ya existe, proceder a la actualizacion de la imagen..."
                        } else {
                            echo "Deployment no existe proceder a aplicarlo..."
                            sh "kubectl apply -f deployment.yaml"
                        }
                    }
                }
            }
        }

        stage('Actualizacion de imagen en minikube...') {
            when {
                branch 'develop'
            }
            agent {
                docker { 
                    image 'bitnami/kubectl:latest'
                    args '--entrypoint=""'
                }
            }
            steps {
                withKubeConfig([credentialsId: 'minikube-kubeconfig']) {
                    sh "kubectl set image deployment/$KUBE_DEPLOYMENT_NAME mi-app-JesusRamirez=$DOCKER_REPO:latest"
                }
            }
        }
    }

    post {
        success {
            mail to: 'lcruzfarfan@gmail.com',
                subject: "Pipeline ${env.JOB_NAME} ejecucion correcta",
                body: """
                Hola,

                El pipeline '${env.JOB_NAME}' (Build #${env.BUILD_NUMBER}) ha finalizado de manera correcta

                Los detalles se pueden revisar en el siguiente enlace:
                ${env.BUILD_URL}

                Saludos,
                Jenkins Server
                """
        }
    }
}