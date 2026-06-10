pipeline {
    agent { label 'local_machine' }

    triggers {
        cron('0 6 * * *')
        pollSCM('* * * * *')
    }

    stages {
        stage('Checkout repository') {
            steps {
                checkout scm
            }
        }
    }
}
