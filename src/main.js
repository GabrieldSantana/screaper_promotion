const { scrapeMercadoLivre } = require('./scraper');
const { sendEmail } = require('./email');
const schedule = require('node-schedule');

const url = 'https://www.mercadolivre.com.br/ofertas';

async function main() {
    console.log('Iniciando scraping do Mercado Livre...');
    const promotions = await scrapeMercadoLivre(url);

    console.log(promotions, "Teste");

    if (promotions.length > 0) {
        console.log('Promoções coletadas:', promotions);
        await sendEmail(promotions);
    } else {
        console.log('Nenhuma promoção coletada.');
    }
}

// Executa imediatamente para teste
main();

// Agenda a execução diária às 8h (horário de Brasília, -03:00)
schedule.scheduleJob('0 8 * * *', async () => {
    console.log('Executando tarefa agendada às', new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
    await main();
});