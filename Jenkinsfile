pipeline {
    agent any

    stages {
        stage('Install & Build') {
            steps {
                script {
                    // Verificamos dónde está el package.json
                    sh '''
                        echo "📂 Workspace actual: $WORKSPACE"
                        echo "📄 Contenido del workspace:"
                        ls -la $WORKSPACE
                        echo "📄 Contenido posible subcarpeta:"
                        ls -la $WORKSPACE/frontend-restaurante-smash_order || true
                    '''

                    // Detectamos si el package.json está en el workspace raíz o dentro de la subcarpeta
                    def buildPath = fileExists('package.json') ? '.' : 'frontend-restaurante-smash_order'

                    sh """
                        echo 'Usando ruta para build: ${buildPath}'
                        docker run --rm -u \$(id -u):\$(id -g) \
                            -v \$WORKSPACE/${buildPath}:/app -w /app \
                            node:22-alpine sh -c '
                                if [ -f package-lock.json ]; then
                                    npm ci
                                else
                                    npm install
                                fi
                                npm run build
                            '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build completado exitosamente"
        }
        failure {
            echo "❌ Error en el build"
        }
    }
}
