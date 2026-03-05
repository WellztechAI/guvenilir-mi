#!/usr/bin/env node
/**
 * fetch-secret.js
 * Secrets Manager'dan DB şifresini çekip backend/.env'e yazar.
 * Kullanım: node fetch-secret.js
 * AWS credentials ~/.aws/credentials veya ortam değişkenlerinden okunur.
 */

'use strict';

const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const fs = require('fs');
const path = require('path');

const SECRET_ARN = 'arn:aws:secretsmanager:eu-north-1:012874738322:secret:rds!db-9fd1b641-820f-42c8-b50c-46e5edc2c8b6-UhFL4L';
const ENV_PATH = path.resolve(__dirname, '.env');

async function main() {
    console.log('[fetch-secret] Secrets Manager\'dan şifre çekiliyor...');

    const client = new SecretsManagerClient({ region: 'eu-north-1' });

    let secret;
    try {
        const response = await client.send(new GetSecretValueCommand({ SecretId: SECRET_ARN }));
        secret = JSON.parse(response.SecretString);
    } catch (err) {
        console.error('[fetch-secret] ❌ Secrets Manager hatası:', err.message);
        console.error('[fetch-secret] AWS credentials gerekli. Lütfen çalıştır:');
        console.error('   aws configure');
        process.exit(1);
    }

    const password = secret.password;
    const username = secret.username || 'postgres';

    if (!password) {
        console.error('[fetch-secret] ❌ Secret içinde "password" alanı bulunamadı.');
        process.exit(1);
    }

    // .env dosyasını güncelle
    let envContent = fs.readFileSync(ENV_PATH, 'utf8');

    envContent = envContent.replace(
        /^DB_PASSWORD=.*$/m,
        `DB_PASSWORD="${password}"`
    );
    envContent = envContent.replace(
        /^DB_USER=.*$/m,
        `DB_USER=${username}`
    );

    fs.writeFileSync(ENV_PATH, envContent, 'utf8');

    console.log(`[fetch-secret] ✅ .env güncellendi:`);
    console.log(`   DB_USER     = ${username}`);
    console.log(`   DB_PASSWORD = ${'*'.repeat(password.length)}`);
    console.log('\n[fetch-secret] Şimdi sunucuyu başlatabilirsin:');
    console.log('   node app.js');
}

main();
