// counter.js
let count = 0; // Счётчик, который будет сохраняться на сервере

// Экспорт API-обработчиков для Vercel
module.exports = (req, res) => {
    if (req.method === 'GET') {
        // Возвращаем текущее значение счётчика
        res.json({ count });
    } else if (req.method === 'POST') {
        // Увеличиваем счётчик на 1 и возвращаем обновленное значение
        count += 1;
        res.json({ count });
    } else {
        // Если используется другой метод, возвращаем ошибку
        res.status(405).send('Method Not Allowed');
    }
};