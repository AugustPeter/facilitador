// Controle das abas
function openTab(tabName) {
  const tabs = document.querySelectorAll('.tabcontent');
  tabs.forEach(tab => tab.style.display = 'none');
  
  const tabElement = document.getElementById(tabName);
  if (tabElement) {
    tabElement.style.display = 'block';
  }
}

// Executar após o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
  // Abre aba padrão
  openTab('buscar');
  
  // Carregar senhas do JSON (da pasta anterior)
  let senhas = {};
  fetch('../senhas.json')
    .then(res => {
      if (!res.ok) {
        throw new Error('Arquivo JSON não encontrado');
      }
      return res.json();
    })
    .then(data => {
      senhas = data;
      console.log('Dados carregados com sucesso:', Object.keys(senhas).length, 'itens');
    })
    .catch(err => {
      console.error('Erro ao carregar o arquivo JSON:', err);
      document.getElementById('resultados').innerHTML = 
        '<li class="no-results">Erro ao carregar os dados. Verifique se o arquivo ../senhas.json existe.</li>';
    });

  // Normalizar texto para busca (remove hífens, espaços, converte para minúsculas)
  function normalizeText(text) {
    return text.replace(/[- ]/g, '').toLowerCase();
  }

  // Função de busca
  function buscar() {
    const query = document.getElementById('serial').value.trim();
    const resultados = Object.entries(senhas)
      .filter(([serial, password]) => {
        // Normaliza ambos os textos para comparação
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

  // Evento buscar
  document.getElementById('buscarBtn').addEventListener('click', buscar);
  document.getElementById('serial').addEventListener('keyup', function(event) {
    if (event.key === "Enter") buscar();
  });
});