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

let responses = ["T.I., ADS", "Web Design, Designer Gráfico", "Operador de Dados", 
    "Soft Skills", "Administração", "Profissional de Saúde", "Desenvolvedor de Games", "Gráfico", "Marketing Digital" ];

// Contabiliza as respostas de cada curso
let courseCount = {};

//contagem das questões à medida que avança
function nextQuestion(e) {
  const course = e.target.getAttribute("data-correct");

  // Adiciona a resposta ao array de respostas
  responses.push(course);

  if (course) {
    // Aumento da contagem do curso
    courseCount[course] = (courseCount[course] || 0) + 1;
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
    textFinish.innerHTML = "RESPOSTA ENVIADA\nSeu ranking de preferência de acordo com o teste:\n";  // Mensagem de introdução

    // Exibe os 3 cursos mais escolhidos com porcentagem
    sortedCourses.slice(0, 3).forEach(([course, count], index) => {
        let percentage = ((count / totalResponses) * 100).toFixed(2);  // Porcentagem calculada corretamente
        textFinish.innerHTML += `${index + 1}. ${course}: ${count} respostas (${percentage}%)<br>`;
    });

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

    div.innerHTML = `
    <button class="answer" data-correct="${answer.course}">
      ${answer.option}
    </button>
    `;

    answers.appendChild(div);
  });

  document.querySelectorAll(".answer").forEach((item) => {
    item.addEventListener("click", nextQuestion);
  });
}

// Inicia o questionário
loadQuestion();
