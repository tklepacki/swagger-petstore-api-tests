pipeline {
    agent { label 'local_machine' }

    parameters {
        choice(
            name: 'test_scope',
            description: 'Test scope',
            choices: ['all', 'smoke', 'regression']
        )
    }

    triggers {
        cron('0 6 * * *')
    }

    environment {
        BASE_URL                   = 'https://petstore.swagger.io/v2/'
        API_KEY                    = 'special-key'
        PLAYWRIGHT_JUNIT_OUTPUT_NAME = 'results.xml'
        GREP                       = "${params.test_scope != 'all' ? params.test_scope : ''}"
        CI                         = 'true'
    }

    stages {
        stage('Checkout repository') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Playwright (no browser — API tests only)') {
            steps {
                sh 'npx playwright install --with-deps chromium'
            }
        }

        stage('Run API tests') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                    sh '''
                        if [ -n "$GREP" ]; then
                            npx playwright test --grep "@$GREP" --reporter=list,html,junit
                        else
                            npx playwright test --reporter=list,html,junit
                        fi
                    '''
                }
            }
        }
    }

    post {
        always {
            junit(
                testResults: 'results.xml',
                allowEmptyResults: false
            )

            publishHTML(target: [
                allowMissing         : false,
                alwaysLinkToLastBuild: true,
                keepAll              : true,
                reportDir            : 'playwright-report',
                reportFiles          : 'index.html',
                reportName           : "Playwright API Tests — #${env.BUILD_NUMBER}"
            ])
        }

        failure {
            archiveArtifacts(
                artifacts      : 'test-results/**',
                allowEmptyArchive: true
            )
        }
    }
}
