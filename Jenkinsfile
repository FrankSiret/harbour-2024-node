pipeline {
    agent any

    stages {
        stage('Build and Push') {
            steps {
                echo 'Building and pushing'
                sh 'docker ps -a'
                sh 'docker build -t ttl.sh/docker-hs-node-frank .'
                sh 'docker push ttl.sh/docker-hs-node-frank'
            }
        }

        stage('Test') {
            steps {
                echo 'Testing api'
                nodejs(nodeJSInstallationName: 'node-21') {
                    sh 'npm config ls'
                    sh 'ls -la'
                    sh 'node -v'
                    sh 'npm -v'
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }

        stage('Deploy to Staging (Target)') {
            steps {
                echo 'Deploying to target'
                withCredentials([sshUserPrivateKey(credentialsId: 'tkey',
                                                   keyFileVariable: 'tkey',
                                                   usernameVariable: 'myuser')]) {
                    sh "ssh ${myuser}@192.168.105.3 -i ${tkey} -o StrictHostKeychecking=no \"docker ps -a\""

                    script {
                        // Stop and remove containers
                        sh "ssh vagrant@192.168.105.3 -i ${tkey} \"docker stop myapp || true && docker rm myapp || true\""
                    }
                    
                    sh "ssh vagrant@192.168.105.3 -i ${tkey} \"docker run -d -p 3000:3000 --name myapp ttl.sh/docker-hs-node-frank\""
                }
            }
        }

        stage('Deploy to Production (AWS)') {
            when {
                branch 'main'
            }
            environment {
                ANSIBLE_HOST_KEY_CHECKING = 'false'
            }
            steps {
                sh 'echo "Deploying to aws..."'

                ansiblePlaybook credentialsId: 'ckey',
                                inventory: 'inventory.ini',
                                playbook: 'playbook.yml'
            }
        }

        stage('Deploy to Production (K8S)') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to k8s'
                withCredentials([sshUserPrivateKey(credentialsId: 'kkey',
                                                   keyFileVariable: 'kkey',
                                                   usernameVariable: 'myuser')]) {

                    echo "Delete existing pod and deployment"
                    sh "ssh ${myuser}@192.168.105.4 -i ${kkey} -o StrictHostKeychecking=no \"kubectl delete pod myapp --ignore-not-found && kubectl delete deployments myapp --ignore-not-found\""

                    sh 'ls -la'
                    sh 'echo "Copy service yaml file"'
                    sh "scp -o StrictHostKeychecking=no -i ${kkey} myapp.yml ${myuser}@192.168.105.4:"
                    
                    sh 'echo "Create pod"'
                    sh "ssh ${myuser}@192.168.105.4 -i ${kkey} \"kubectl run myapp --image=ttl.sh/docker-hs-node-frank\""

                    sh 'echo "Refresh service"'
                    sh "ssh ${myuser}@192.168.105.4 -i ${kkey} \"kubectl apply -f myapp.yml\""

                    sh 'echo "Create deployments"'
                    sh "ssh ${myuser}@192.168.105.4 -i ${kkey} \"kubectl create deployment myapp --image=ttl.sh/docker-hs-node-frank && kubectl scale --replicas=2 deployment/myapp\""
                }
            }

        }
    }
}