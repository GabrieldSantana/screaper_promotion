const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeMercadoLivre(url) {
    try {
    // Faz a requisição HTTP com cabeçalhos para evitar bloqueios
    const response = await axios.get(url, {
        headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        },
        timeout: 10000 // 10 segundos de timeout
    });

    // Carrega o HTML no Cheerio
    const $ = cheerio.load(response.data);
    const promotions = [];

    // Seletor para promoções do dia
    $('div.andes-card.poly-card--grid-card').each((index, element) => {
        const titulo = $(element).find('a.poly-component__title').text().trim();
        const precoAtualReais = $(element).find('div.poly-price__current span.andes-money-amount__fraction').text().trim();
        const precoAtualCentavos = $(element).find('div.poly-price__current span.andes-money-amount__cents').text().trim();
        const precoAntigoReais = $(element).find('s.andes-money-amount--previous span.andes-money-amount__fraction').text().trim();
        const precoAntigoCentavos = $(element).find('s.andes-money-amount--previous span.andes-money-amount__cents').text().trim();
        const desconto = $(element).find('span.andes-money-amount__discount').text().trim();
        const marca = $(element).find('span.poly-component__brand').text().trim();
        const link = $(element).find('a.poly-component__title').attr('href') || '#';
        if (titulo && link) {
            const precoAtual = precoAtualReais + "," + precoAtualCentavos;
            const precoAntigo = precoAntigoReais + "," + precoAntigoCentavos;
        promotions.push({ titulo, precoAtual, precoAntigo, desconto, marca, link });
        }
    });

    return promotions.slice(0, 10); // Limita a 10 promoções
    } catch (error) {
    console.error('Erro no scraping:', error.message);
    return [];
    }
}

module.exports = { scrapeMercadoLivre };