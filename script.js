// DATA
function atualizarData() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
  
    const dataFormatada = `${dia}/${mes}/${ano}`;
    document.getElementById("dataAtual").textContent = dataFormatada;
  }
atualizarData();


// SAUDAÇÃO
// Obter a hora atual
const agora = new Date();
const hora = agora.getHours();

// Função para exibir a saudação
function exibirSaudacao() {
  let saudacao;

  if (hora >= 5 && hora < 12) {
    saudacao = "Bom dia!";
  } else if (hora >= 12 && hora < 18) {
    saudacao = "Boa tarde!";
  } else {
    saudacao = "Boa noite!";
  }

  // Exibir a saudação no elemento HTML
  document.getElementById("saudacao").textContent = saudacao;
}
exibirSaudacao();


// RELÓGIO
function atualizarRelogio() {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const segundos = String(agora.getSeconds()).padStart(2, '0');
  
    const horarioFormatado = `${horas}:${minutos}:${segundos}`;
    document.getElementById('relogio').textContent = horarioFormatado;
}
setInterval(atualizarRelogio, 1000); // Atualiza a cada segundo
atualizarRelogio(); // Chama uma vez no início para evitar atraso


// API CLIMA
async function updateClima(cityName = 'Moscow') {
    const apiKey = '1936e3e472c9fc2db31965b0b6fbe402';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=pt_br`;

    // Mapeamento de ícones para imagens personalizadas
    const customIcons = {
        '01d': 'imagens/ceuLimpo.png', // Céu limpo (dia)
        '03d': 'imagens/nublado.png', // Nublado
        '09d': 'imagens/chuva.png', // Chuva leve
        '11d': 'imagens/trovoadas.png', // Trovoadas
        '13d': 'imagens/neve.png', // Neve
    };

    try {
        const response = await fetch(url);
        const data = await response.json();

        const weatherInfo = document.getElementById('weatherInfo');
        const city = data.name;
        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const icon = data.weather[0].icon; // Código do ícone

        // Use a imagem personalizada ou o ícone padrão da API
        const iconUrl = customIcons[icon] || `http://openweathermap.org/img/wn/${icon}@2x.png`;

        weatherInfo.innerHTML = `
            <p><strong>Cidade:</strong> ${city}</p>
            <p><strong>Temperatura:</strong> ${temperature}°C</p>
            <p><strong>Descrição:</strong> ${description}</p>
            <img src="${iconUrl}" alt="${description}" />
        `;
    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        document.getElementById('weatherInfo').textContent = 'Erro ao carregar dados do clima.';
    }
}

// Evento para buscar o clima ao clicar no botão
document.getElementById('searchWeather').addEventListener('click', () => {
    const cityName = document.getElementById('citySearch').value;
    if (cityName) {
        updateClima(cityName);
    } else {
        alert('Por favor, insira o nome de uma cidade.');
    }
});

// Chama a função para atualizar o clima ao carregar a página
updateClima();

// QUADRO DE DESENHOS
const canvas = document.getElementById('quadro');
const ctx = canvas.getContext('2d');
const corInput = document.getElementById('cor');
const modoSelect = document.getElementById('modo');
const espessuraInput = document.getElementById('espessura');
const limparBtn = document.getElementById('limpar');

let desenhando = false;
let inicioX = 0, inicioY = 0;

let cor = corInput.value;
let modo = modoSelect.value;
let espessura = espessuraInput.value;

corInput.addEventListener('input', () => cor = corInput.value);
modoSelect.addEventListener('change', () => modo = modoSelect.value);
espessuraInput.addEventListener('input', () => espessura = espessuraInput.value);

limparBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Eventos de mouse
canvas.addEventListener('mousedown', (e) => {
  desenhando = true;
  inicioX = e.offsetX;
  inicioY = e.offsetY;

  if (modo === 'livre' || modo === 'borracha') {
    ctx.beginPath();
    ctx.moveTo(inicioX, inicioY);
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!desenhando) return;

  const x = e.offsetX;
  const y = e.offsetY;

  if (modo === 'livre') {
    ctx.strokeStyle = cor;
    ctx.lineWidth = espessura;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  if (modo === 'borracha') {
    ctx.strokeStyle = "#fff"; // fundo branco
    ctx.lineWidth = espessura * 2;
    ctx.lineTo(x, y);
    ctx.stroke();
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (!desenhando) return;
  desenhando = false;

  const fimX = e.offsetX;
  const fimY = e.offsetY;

  ctx.strokeStyle = cor;
  ctx.fillStyle = cor;
  ctx.lineWidth = espessura;

  if (modo === 'linha') {
    ctx.beginPath();
    ctx.moveTo(inicioX, inicioY);
    ctx.lineTo(fimX, fimY);
    ctx.stroke();
  }

  if (modo === 'retangulo') {
    const largura = fimX - inicioX;
    const altura = fimY - inicioY;
    ctx.strokeRect(inicioX, inicioY, largura, altura);
  }

  if (modo === 'circulo') {
    const raio = Math.sqrt(Math.pow(fimX - inicioX, 2) + Math.pow(fimY - inicioY, 2));
    ctx.beginPath();
    ctx.arc(inicioX, inicioY, raio, 0, 2 * Math.PI);
    ctx.stroke();
  }
});

canvas.addEventListener('mouseleave', () => {
  desenhando = false;
});


// BLOCO DE NOTAS
function salvarNotas() {
    var texto = document.getElementById("meuBlocoDeNotas").value;
    localStorage.setItem("notas", texto);
    alert("Notas salvas!");
}
    // Carregar notas salvas ao carregar a página
    window.onload = function() {
        var notasSalvas = localStorage.getItem("notas");
        if (notasSalvas) {
            document.getElementById("meuBlocoDeNotas").value = notasSalvas;
        }
};


// LISTA DE TAREFAS
const novaTarefaInput = document.getElementById('novaTarefa');
const adicionarTarefaBtn = document.getElementById('adicionarTarefa');
const listaTarefas = document.getElementById('listaTarefas');

function carregarTarefas() {
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  listaTarefas.innerHTML = '';

  tarefas.forEach((tarefa, index) => {
    const li = document.createElement('li');
    li.textContent = tarefa.texto;
    li.style.textDecoration = tarefa.concluida ? 'line-through' : 'none';
    li.style.cursor = 'pointer';

    // Marcar como concluída ao clicar
    li.addEventListener('click', () => {
      tarefas[index].concluida = !tarefas[index].concluida;
      salvarTarefas(tarefas);
      carregarTarefas();
    });

    // Botão de remover
    const btnRemover = document.createElement('button');
    btnRemover.textContent = '🗑️';
    btnRemover.style.marginLeft = '10px';
    btnRemover.addEventListener('click', () => {
      tarefas.splice(index, 1);
      salvarTarefas(tarefas);
      carregarTarefas();
    });

    li.appendChild(btnRemover);
    listaTarefas.appendChild(li);
  });
}

function salvarTarefas(tarefas) {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

adicionarTarefaBtn.addEventListener('click', () => {
  const texto = novaTarefaInput.value.trim();
  if (texto !== '') {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.push({ texto, concluida: false });
    salvarTarefas(tarefas);
    novaTarefaInput.value = '';
    carregarTarefas();
  } else {
    alert('Digite uma tarefa!');
  }
});

// Carrega as tarefas ao iniciar
carregarTarefas();

// CAMERA
const videoElement = document.getElementById('webcamVideo');
const btnLigar = document.getElementById('btnLigarCamera');
const btnDesligar = document.getElementById('btnDesligarCamera');
const btnTirarFoto = document.getElementById('btnTirarFoto');
const canvasFoto = document.getElementById('canvasFoto');
const btnApagarFoto = document.getElementById('btnApagarFoto');
const downloadLink = document.getElementById('downloadLink');
const statusElement = document.getElementById('status');
const btnAplicarFiltro = document.getElementById('btnAplicarFiltro');
let streamAtual; // Para guardar a referência do stream e poder pará-lo

async function iniciarCamera() {
  statusElement.textContent = "Solicitando acesso à câmera...";
  try {
    const constraints = { video: true, audio: false }; // Pedimos apenas vídeo
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                
    videoElement.srcObject = stream;
    streamAtual = stream; // Guarda o stream
                
    statusElement.textContent = "Câmera ativa.";
    btnLigar.style.display = 'none';
    btnDesligar.style.display = 'inline-block';
    btnTirarFoto.style.display = 'inline-block';
    btnAplicarFiltro.style.display = 'inline-block';

  } catch (error) {
    console.error("Erro ao acessar a câmera: ", error);
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      statusElement.textContent = "Permissão para acessar a câmera negada.";
    } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      statusElement.textContent = "Nenhuma câmera encontrada.";
    } else {
      statusElement.textContent = `Erro ao acessar câmera: ${error.message}`;
    }
  }
}

function pararCamera() {
  if (streamAtual) {
    streamAtual.getTracks().forEach(track => {
      track.stop(); // Para cada trilha (vídeo, áudio) no stream
  });
    videoElement.srcObject = null; // Limpa o vídeo
    streamAtual = null;
    statusElement.textContent = "Câmera desligada.";
    btnLigar.style.display = 'inline-block';
    btnDesligar.style.display = 'none';
    btnTirarFoto.style.display = 'none';
    btnAplicarFiltro.style.display = 'none';
    canvasFoto.style.display = 'none';
    btnApagarFoto.style.display = 'none';
    downloadLink.style.display = 'none';
  }
}

function tirarFoto() {
  const contexto = canvasFoto.getContext('2d');
  canvasFoto.width = videoElement.videoWidth; // Define a largura do canvas
  canvasFoto.height = videoElement.videoHeight; // Define a altura do canvas
  contexto.drawImage(videoElement, 0, 0, canvasFoto.width, canvasFoto.height);
  canvasFoto.style.display = 'block'; // Exibe o canvas com a foto tirada
  btnApagarFoto.style.display = 'inline-block'; // Exibe o botão de apagar foto
  downloadLink.style.display = 'inline-block'; // Exibe o link de download
  statusElement.textContent = "Foto tirada!";

// Gerar link para download da foto
  const dataURL = canvasFoto.toDataURL('image/png');
  downloadLink.href = dataURL;
  downloadLink.download = 'foto.png';
  downloadLink.textContent = 'Baixar Foto';
}

function apagarFoto() {
  const contexto = canvasFoto.getContext('2d');
  contexto.clearRect(0, 0, canvasFoto.width, canvasFoto.height); // Limpa o canvas
  canvasFoto.style.display = 'none'; // Esconde o canvas
  btnApagarFoto.style.display = 'none'; // Esconde o botão de apagar foto
  downloadLink.style.display = 'none'; // Esconde o link de download
  statusElement.textContent = "Foto apagada!";
}

function aplicarFiltro() {
  const contexto = canvasFoto.getContext('2d');
  const imageData = contexto.getImageData(0, 0, canvasFoto.width, canvasFoto.height); // Pega os dados da imagem
  const pixels = imageData.data; // Array com os dados dos pixels

  for (let i = 0; i < pixels.length; i += 4) { // Para cada pixel
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Calcula a média para escala de cinza
    const media = (r + g + b) / 3;

    pixels[i] = media;     // Red
    pixels[i + 1] = media; // Green
    pixels[i + 2] = media; // Blue
    
  }
  contexto.putImageData(imageData, 0, 0); // Coloca os dados de volta no canvas
  statusElement.textContent = "Filtro aplicado!";
}

btnLigar.addEventListener('click', iniciarCamera);
btnDesligar.addEventListener('click', pararCamera);
btnTirarFoto.addEventListener('click', tirarFoto);
btnApagarFoto.addEventListener('click', apagarFoto);
btnAplicarFiltro.addEventListener('click', aplicarFiltro);

// Checar suporte inicial
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  statusElement.textContent = "API da Câmera (getUserMedia) não suportada neste navegador.";
  btnLigar.disabled = true;
};

// MÚSICA
const musicas = [
  {
    nomeMusica: "Loveeeee song",
    artista: "Rihanna",
    capa: "imagens/lovesong.jpg",
    arquivo: "audios/rihanna.mp3" 
  },
  {
    nomeMusica: "Deja vu",
    artista: "Olivia Rodrigo",
    capa: "imagens/dejavu.jpg",
    arquivo: "audios/OliviaRodrigo.mp3"
  },
  {
    nomeMusica: "Nosso Sonho",
    artista: "Claudinho e Buchecha",
    capa: "imagens/NossoSonho.png",
    arquivo: "audios/ClaudinhoBuchecha.mp3"
  },
  {
    nomeMusica: "Me encontra",
    artista: "Charlie Brown Jr.",
    capa: "imagens/meEncontra.png",
    arquivo: "audios/CBJR.mp3"
  },
];

let indiceAtual = 0;
const audio = document.getElementById('audio-player');
const capa = document.getElementById('musica-capa');
const nomeMusica = document.getElementById('musica-nome');
const artista = document.getElementById('artista');
const botao = document.getElementById('botao');
const icone = document.getElementById('icone');
const Anterior = document.getElementById('btn-anterior');
const Proximo = document.getElementById('btn-proximo');
const tempoAtual = document.getElementById('tempo-atual');
const tempoTotal = document.getElementById('tempo-total');
const progresso = document.getElementById('progresso');

function carregarMusica(indice) {
  const musica = musicas[indice];
  console.log('Carregando música:', musica.nomeMusica, musica.arquivo); // Log para depuração
  capa.src = musica.capa;
  nomeMusica.textContent = musica.nomeMusica;
  artista.textContent = musica.artista;
  audio.src = musica.arquivo;
  progresso.value = 0;
  tempoAtual.textContent = "0:00";
  tempoTotal.textContent = "0:00";
}

function formatarTempo(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60);
  return `${min}:${seg.toString().padStart(2, '0')}`;
}

// Atualiza o tempo total e configura o progresso
audio.addEventListener('loadedmetadata', () => {
  tempoTotal.textContent = formatarTempo(audio.duration);
  progresso.max = Math.floor(audio.duration);
});

// Atualiza o tempo atual e o progresso enquanto a música toca
audio.addEventListener('error', () => {
  console.error('Erro ao carregar o arquivo de áudio:', audio.src);
  alert('Não foi possível carregar a música. Verifique o caminho do arquivo.');
});

// Permite que o usuário controle o progresso da música
progresso.addEventListener('input', () => {
  audio.currentTime = progresso.value;
});

// Botão de Play/Pause
botao.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch(error => {
      console.error('Erro ao reproduzir áudio:', error);
      alert('Não foi possível reproduzir a música. Verifique as permissões do navegador.');
    });
    icone.textContent = '⏸';
  } else {
    audio.pause();
    icone.textContent = '▶';
  }
});

// Botão de Anterior
Anterior.addEventListener('click', () => {
  indiceAtual = (indiceAtual - 1 + musicas.length) % musicas.length; // Navega para a música anterior
  carregarMusica(indiceAtual);
  audio.play();
});

// Botão de Próximo
Proximo.addEventListener('click', () => {
  indiceAtual = (indiceAtual + 1) % musicas.length; // Navega para a próxima música
  carregarMusica(indiceAtual);
  audio.play();
});

// Passa automaticamente para a próxima música ao término
audio.addEventListener('ended', () => {
  Proximo.click(); // Simula o clique no botão de próximo
});

// Carrega a música inicial
carregarMusica(indiceAtual);


// CALENDÁRIO
document.addEventListener('DOMContentLoaded', () => {
  const currentMonthYearHeader = document.getElementById('currentMonthYear');
  const calendarGrid = document.getElementById('calendarGrid');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');

  let currentDate = new Date(); // Objeto Date para manter o mês e ano atuais exibidos
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  // Array com os nomes dos meses para exibição
  const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Função principal para renderizar o calendário
  function renderCalendar() {
      // Limpa o grid atual antes de renderizar o novo mês
      calendarGrid.innerHTML = '';

      // Atualiza o cabeçalho com o mês e ano atuais
      currentMonthYearHeader.textContent = `${monthNames[currentMonth]} ${currentYear}`;

      // Obtém o primeiro dia do mês (0 = domingo, 1 = segunda, etc.)
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

      // Obtém o número de dias no mês atual
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      // Preenche os dias "vazios" no início do mês (para alinhar com o dia da semana correto)
      for (let i = 0; i < firstDayOfMonth; i++) {
          const emptyDiv = document.createElement('div');
          emptyDiv.classList.add('empty');
          calendarGrid.appendChild(emptyDiv);
      }

      // Preenche os dias do mês
      for (let day = 1; day <= daysInMonth; day++) {
          const dayDiv = document.createElement('div');
          dayDiv.textContent = day;
          dayDiv.dataset.date = `${currentYear}-${currentMonth + 1}-${day}`; // Adiciona um atributo de dado para identificar a data

          // Marca o dia atual (se for o mês e ano atuais)
          if (day === new Date().getDate() &&
              currentMonth === new Date().getMonth() &&
              currentYear === new Date().getFullYear()) {
              dayDiv.classList.add('today');
          }

          calendarGrid.appendChild(dayDiv);
      }
  }
  // Navegação para o mês anterior
  prevMonthBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
          currentMonth = 11; // Volta para dezembro
          currentYear--;     // Decrementa o ano
      }
      renderCalendar();
  });

  // Navegação para o próximo mês
  nextMonthBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
          currentMonth = 0; // Vai para janeiro
          currentYear++;     // Incrementa o ano
      }
      renderCalendar();
  });

  // Renderiza o calendário inicial quando a página carrega
  renderCalendar();
});


// Calculadora
const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const specialChars = ["%", "*", "/", "-", "+", "="];

let output = "";

const calculate = (btnValue) => {
    display.focus();

    if (btnValue === "=" && output !== "") {
        try {
            output = eval(output.replace("%", "/100"));
        } catch (e) {
            output = "Erro";
        }
    }
    else if (btnValue === "AC") {
        output = "";
    }
    else if (btnValue === "DEL") {
        output = output.slice(0, -1);
    }
    else {
        if (output === "" && specialChars.includes(btnValue)) {
            return; // Impede começar com operador
        }
        output += btnValue;
    }

    display.value = output;
};

buttons.forEach((button) => {
    button.addEventListener("click", (e) => calculate(e.target.dataset.value));
});
