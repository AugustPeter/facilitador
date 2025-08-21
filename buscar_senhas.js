// Dados iniciais vazios
let senhas = {};

// Função para carregar JSON com fallback
async function carregarSenhas() {
    try {
        // Tenta carregar o arquivo JSON
        const response = await fetch('senhas.json');
        
        if (!response.ok) {
            throw new Error('Arquivo não encontrado');
        }
        
        const data = await response.json();
        senhas = data;
        console.log('Dados carregados do JSON:', Object.keys(senhas).length, 'itens');
        
    } catch (error) {
        console.error('Erro ao carregar JSON:', error);
        // Dados de exemplo para teste
        senhas = {
            "1425G-A": "XyZ123Ab",
            "1425G-B": "PqR456Cd", 
            "2687H-C": "LmN789Ef",
            "3592K-D": "GhI012Jk",
            "4426M-E": "OpQ345Rs"
        };
        console.log('Usando dados de exemplo');
    }
}

// Normalizar texto para busca
function normalizeText(text) {
    return text.replace(/[- ]/g, '').toLowerCase();
}

// Função de busca
function buscar() {
    const query = document.getElementById('serial').value.trim();
    const resultados = Object.entries(senhas)
        .filter(([serial, password]) => {
            const normalizedSerial = normalizeText(serial);
            const normalizedQuery = normalizeText(query);
            return normalizedSerial.includes(normalizedQuery);
        });

    const ul = document.getElementById('resultados');
    ul.innerHTML = '';
    
    if (resultados.length === 0) {
        ul.innerHTML = '<li class="no-results">Nenhum resultado encontrado para: ' + query + '</li>';
    } else {
        resultados.forEach(([serial, password]) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="serial">${serial}</span>
                <span class="password">${password}</span>
            `;
            ul.appendChild(li);
        });
    }
}

// Executar após o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    // Carregar os dados primeiro
    carregarSenhas().then(() => {
        console.log('Sistema pronto para uso');
    });
    
    // Evento buscar
    document.getElementById('buscarBtn').addEventListener('click', buscar);
    document.getElementById('serial').addEventListener('keyup', function(event) {
        if (event.key === "Enter") buscar();
    });
});