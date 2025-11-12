pipeline {
    agent any

    environment {
        REGISTRY = "ghcr.io"
        IMAGE_NAME = "victorandres123/frontend-restaurante-smash_order"
        NODE_IMAGE = "node:22-alpine"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "📥 Descargando código fuente..."
                checkout scm
                sh '''
                    echo "📂 Workspace actual: $WORKSPACE"
                    echo "📄 Contenido del workspace tras checkout:"
                    ls -la $WORKSPACE
                '''
            }
        }

        stage('Install & Build') {
            steps {
                script {
                    // Detectar si el package.json está en el raíz o en subcarpeta
                    def buildPath = fileExists('package.json') ? '.' : 'frontend-restaurante-smash_order'

                    sh """
                        echo "🚀 Usando ruta para build: ${buildPath}"
                        echo "📦 Archivos disponibles antes de montar:"
                        ls -la ${buildPath}

                        echo "👷 Corrigiendo permisos de workspace..."
                        sudo chown -R jenkins:jenkins ${WORKSPACE} || true

                        echo "🐳 Ejecutando build dentro del contenedor Node..."
                        docker run --rm \
                            -v ${WORKSPACE}/${buildPath}:/app \
                            -w /app \
                            ${NODE_IMAGE} sh -c '
                                echo "📦 Archivos en /app:"
                                ls -la /app
                                if [ -f package-lock.json ]; then
                                    echo "📦 Ejecutando npm ci..."
                                    npm ci
                                else
                                    echo "📦 Ejecutando npm install..."
                                    npm install
                                fi
                                echo "🏗️ Ejecutando build..."
                                npm run build
                            '
                    """
                }
            }
        }

        stage('Build & Tag Image') {
            steps {
                script {
                    echo "🐳 Construyendo imagen Docker..."
                    def commit = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    sh """
                        docker build -t ${REGISTRY}/${IMAGE_NAME}:${commit} -t ${REGISTRY}/${IMAGE_NAME}:latest .
                    """
                }
            }
        }

        stage('Push Image') {
            steps {
                script {
                    echo "📤 Enviando imagen al registro..."
                    def commit = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    withCredentials([string(credentialsId: 'ghcr-token', variable: 'TOKEN')]) {
                        sh """
                            echo $TOKEN | docker login ${REGISTRY} -u ${IMAGE_NAME} --password-stdin
                            docker push ${REGISTRY}/${IMAGE_NAME}:${commit}
                            docker push ${REGISTRY}/${IMAGE_NAME}:latest
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build y push completados exitosamente."
        }
        failure {
            echo "❌ Error en el build."
        }
    }
}