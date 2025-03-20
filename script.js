const question = document.querySelector(".question");
const answers = document.querySelector(".answers");
const spnQtd = document.querySelector(".spnQtd");
const textFinish = document.querySelector(".finish span");
const content = document.querySelector(".content");
const contentFinish = document.querySelector(".finish");

import questions from "./questions.js";

// Variáveis do questionário
let currentIndex = 0;
let questionsCorrect = 0;
let responses = [];

// Contabiliza as respostas de cada curso
let courseCount = {};
// Contabiliza as respostas de cada profile
let profileCount = {};

//contagem das questões à medida que avança
function nextQuestion(e) {
  const course = e.target.getAttribute("data-course");
  const profile = e.target.getAttribute("data-profile");

  if (course !== undefined && course !== null) {
    console.log("Curso escolhido:", course);

    // Adiciona a resposta ao array de respostas
    responses.push(course);

    // Aumento da contagem do curso
    courseCount[course] = (courseCount[course] || 0) + 1;
  }

  if (profile !== undefined && profile !== null) {
    console.log("Profile escolhido:", profile);

    // Aumento da contagem do profile
    profileCount[profile] = (profileCount[profile] || 0) + 1;
  }

  if (currentIndex < questions.length - 1) {
    currentIndex++;
    loadQuestion();
  } else {
    finish();  // Chama a função finish após a última pergunta
  }
}

// Função para calcular e exibir os cursos mais escolhidos
function finish() {
  // Esconde o conteúdo das perguntas e mostra o conteúdo de resultados
  content.style.display = 'none';      // Esconde a seção de perguntas
  contentFinish.style.display = 'block';  // Mostra a seção de resultados

  // Calcula o total de respostas (quantidade total de respostas do usuário)
  let totalResponses = responses.length;

  // Ordena os cursos pela quantidade de respostas
  let sortedCourses = Object.entries(courseCount).sort((a, b) => b[1] - a[1]);

  // Exibe o resultado final
  textFinish.innerHTML = "RESPOSTA ENVIADA<br>Seu ranking de preferência de acordo com o teste:<br><br>";  // Mensagem de introdução

  // Exibe os 3 cursos mais escolhidos com porcentagem
  sortedCourses.slice(0, 3).forEach(([course, count], index) => {
    let percentage = ((count / totalResponses) * 100).toFixed(2);  // Porcentagem calculada corretamente
    textFinish.innerHTML += `${index + 1}. ${course}: ${count} respostas (${percentage}%)<br>`;
  });

  // Encontra o profile mais escolhido
  let mostChosenProfile = "";
  let maxProfileCount = 0;
  for (const profile in profileCount) {
    if (profileCount[profile] > maxProfileCount) {
      maxProfileCount = profileCount[profile];
      mostChosenProfile = profile;
    }
  }

  // Exibe a mensagem do profile
  if (mostChosenProfile) {
    let profileMessage = "";
    switch (mostChosenProfile) {
      case "Dominância":
        profileMessage = "Segundo suas respostas, o seu perfil é Dominante: Focado em resultados, é assertivo e toma decisões rápidas.";
        break;
      case "Influência":
        profileMessage = "Segundo suas respostas, o seu perfil é Influente: Sociável, persuasivo e motivador, gosta de interagir e influenciar os outros.";
        break;
      case "Estabilidade":
        profileMessage = "Segundo suas respostas, o seu perfil é Estável: Calmo, paciente e leal, valoriza a harmonia e o trabalho em equipe.";
        break;
      case "Conformidade":
        profileMessage = "Segundo suas respostas, o seu perfil é Conforme: Analítico, detalhista e preciso, segue regras e busca qualidade.";
        break;
    }
    textFinish.innerHTML += `<br><br>${profileMessage}`;
  }

  // Desabilita os botões de resposta para evitar múltiplos cliques
  document.querySelectorAll(".answer").forEach((item) => {
    item.disabled = true;
  });
}

// Função para carregar e exibir a nova pergunta no questionário
function loadQuestion() {
  spnQtd.innerHTML = `${currentIndex + 1}/${questions.length}`;
  const item = questions[currentIndex];
  answers.innerHTML = "";
  question.innerHTML = item.question;

  item.answers.forEach((answer) => {
    const div = document.createElement("div");
    const button = document.createElement("button");
    button.classList.add("answer");
    button.textContent = answer.option;

    if (answer.course) {
      button.setAttribute("data-course", answer.course);
    }
    if (answer.profile) {
      button.setAttribute("data-profile", answer.profile);
    }

    button.addEventListener("click", nextQuestion);

    div.appendChild(button);
    answers.appendChild(div);
  });
}

// Inicia o questionário
loadQuestion();