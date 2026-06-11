pipeline {
    agent { label 'local_machine' }

    triggers {
        cron('0 6 * * *')
        pollSCM('* * * * *')
    }

    environment {
        BASE_URL                     = 'https://petstore.swagger.io/v2/'
        API_KEY                      = 'special-key'
        PLAYWRIGHT_JUNIT_OUTPUT_NAME = 'results.xml'
        CI                           = 'true'
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
                sh 'npx playwright test --reporter=list,html,junit'
            }
        }
    }
}
