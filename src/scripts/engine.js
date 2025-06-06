// Seleciona os elementos do DOM
const pianoKeys = document.querySelectorAll(".piano-keys .key");
const volumeSlider = document.querySelector(".volume-slider input"); // Slider de volume do piano
const keysCheck = document.querySelector(".keys-check input");
const backgroundSondButton = document.getElementById("base_background"); // Botão "Som Base"

// Array para armazenar as chaves de dados das teclas do piano
const mapedKeys = [];

// Objeto para armazenar as instâncias de Audio para CADA nota do piano
const audioMap = {};

// Instância de Audio para o som de fundo (o bat.wav)
const backgroundAudio = new Audio("./src/tunes/bat.wav"); // <--- VERIFIQUE ESTE CAMINHO!
backgroundAudio.loop = true; // Faz o áudio tocar em loop
let isBackgroundPlaying = false; // Flag para controlar o estado do som de fundo (ligado/desligado)


// Pré-carrega todos os áudios das notas do piano e popula `mapedKeys`
pianoKeys.forEach((key) => {
    const note = key.dataset.key; // Pega a chave da nota (ex: "a", "s", "d")
    mapedKeys.push(note); // Adiciona a chave ao array mapedKeys

    // Cria e armazena uma instância de Audio para CADA nota do piano
    audioMap[note] = new Audio(`./src/tunes/${note}.wav`); // <--- VERIFIQUE ESTES CAMINHOS!
});


// Função para tocar uma nota do piano
const playTune = (key) => {
    const audio = audioMap[key]; // Pega a instância de áudio ESPECÍFICA para esta nota
    if (audio) { // Garante que a nota existe no `audioMap`
        audio.currentTime = 0; // Reinicia o áudio para o começo (permite tocar rápido e acordes)

        // O volume do piano é controlado APENAS pelo slider de volume do piano
        audio.volume = parseFloat(volumeSlider.value); // Usa o valor ATUAL do slider do piano
        audio.play();

        const clickedKey = document.querySelector(`[data-key="${key}"]`);
        if (clickedKey) { // Garante que a tecla existe no DOM
            clickedKey.classList.add("active");
            setTimeout(() => {
                clickedKey.classList.remove("active");
            }, 150);
        }
    }
};


// Event listener para cliques nas teclas do piano
pianoKeys.forEach((key) => {
    key.addEventListener("click", () => playTune(key.dataset.key));
});


// Event listener para pressionar teclas do teclado
document.addEventListener("keydown", (e) => {
    // Garante que a tecla pressionada está mapeada E que não é um evento de repetição (segurar a tecla)
    if (mapedKeys.includes(e.key) && !e.repeat) {
        playTune(e.key);
    }
});


// A função handleVolume não é mais estritamente necessária para controlar o volume do piano,
// pois o volume é aplicado diretamente em `playTune` usando o valor do slider.
// No entanto, se você quiser manter um listener para o slider (ex: para feedback visual),
// pode mantê-lo, mas não precisa atribuir o volume a uma variável global de áudio.
const handleVolume = (e) => {
    // O volume do piano é definido na função `playTune` usando `volumeSlider.value`.
};


// Função para mostrar/esconder as letras das teclas
const showHideKeys = () => {
    pianoKeys.forEach((key) => key.classList.toggle("hide"));
};


// Adiciona event listeners aos controles
volumeSlider.addEventListener("input", handleVolume);
keysCheck.addEventListener("click", showHideKeys);


// Lógica para o botão "Som Base": Ligar e Desligar
backgroundSondButton.addEventListener("click", () => {
    if (isBackgroundPlaying) {
        // Se o som está tocando, pausa
        backgroundAudio.pause();
        backgroundSondButton.textContent = "Som Base"; // Muda o texto do botão
        backgroundSondButton.classList.remove("active"); // Remove a classe CSS 'active'
    } else {
        // Se o som está pausado, toca
        // Define o volume do som de base (AJUSTE ESTE VALOR para o seu gosto: 0.0 a 1.0)
        backgroundAudio.volume = 0.5; // Exemplo: 50% do volume.

        // Tenta tocar o áudio. O `.catch` é para lidar com bloqueios de autoplay do navegador.
        backgroundAudio.play().catch(error => {
            console.error("Erro ao tocar som de fundo:", error);
            alert("O navegador pode ter bloqueado a reprodução automática. Por favor, interaja com a página primeiro.");
        });
        backgroundSondButton.textContent = "Pausar Base"; // Muda o texto do botão
        backgroundSondButton.classList.add("active"); // Adiciona a classe CSS 'active'
    }
    isBackgroundPlaying = !isBackgroundPlaying; // Inverte o estado da flag
});