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
            // Detectar si el package.json está en el workspace raíz o dentro de una subcarpeta
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
                    node:22-alpine sh -c '
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