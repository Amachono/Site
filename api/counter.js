const admin = require("firebase-admin");
const bucketName = "gs://database-34bec.appspot.com/counter.txt";

// Инициализация Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(require("./serviceAccountKey.json")),
    storageBucket: "database-34bec.appspot.com"
});

const bucket = admin.storage().bucket(bucketName);

// Функция для чтения значения счётчика из GCS
async function readCounter() {
    try {
        const file = bucket.file("counter.txt");
        const [exists] = await file.exists();

        if (exists) {
            const [contents] = await file.download();
            return parseInt(contents.toString(), 10) || 0;
        } else {
            return 0;
        }
    } catch (error) {
        console.error("Ошибка чтения из GCS:", error);
        return 0;
    }
}

// Функция для записи значения счётчика в GCS
async function writeCounter(count) {
    try {
        const file = bucket.file("counter.txt");
        await file.save(count.toString());
    } catch (error) {
        console.error("Ошибка записи в GCS:", error);
    }
}

// Инициализация счётчика
let count = await readCounter();

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        res.json({ count });
    } else if (req.method === 'POST') {
        count += 1;
        await writeCounter(count); // Сохраняем новое значение в GCS
        res.json({ count });
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
