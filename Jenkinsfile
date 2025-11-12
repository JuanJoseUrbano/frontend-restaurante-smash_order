pipeline {
    agent any

    environment {
        NODE_IMAGE = 'node:22-alpine'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Descargando código fuente...'
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
                    // Detectar si el package.json está en el root o dentro de una subcarpeta
                    def buildPath = fileExists('package.json') ? '.' : 'frontend-restaurante-smash_order'

                    sh """
                        echo "🚀 Usando ruta para build: ${buildPath}"
                        echo "📦 Archivos disponibles antes de montar:"
                        ls -la ${buildPath}

                        docker run --rm -u \$(id -u):\$(id -g) \
                            -v ${pwd()}/${buildPath}:/app -w /app \
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
    }

    post {
        success {
            echo '✅ Build completado correctamente.'
        }
        failure {
            echo '❌ Error en el build.'
        }
    }
}
