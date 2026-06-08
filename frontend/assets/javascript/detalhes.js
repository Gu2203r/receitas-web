document.addEventListener("DOMContentLoaded", () => {

    const urlParams = new URLSearchParams(window.location.search);
    const receitaId = urlParams.get('id');

    if (!receitaId) {

        window.location.href = 'index.html';
        return;
    }

    carregarDetalhesReceita(receitaId);
    configurarFormularioAvaliacao(receitaId);
});

function carregarDetalhesReceita(id) {
    fetch(`${API_BASE_URL}/detalhes?id=${id}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Receita não encontrada');
        }
        return response.json();
    })
    .then(receita => {

        document.getElementById('nome-receita').textContent = receita.nome;
        document.getElementById('tempo-receita').innerHTML = `⏱️ ${receita.tempo_preparo} min`;
        document.getElementById('rendimento-receita').innerHTML = `🍽️ ${receita.rendimento}`;
        document.getElementById('categoria-receita').innerHTML = `🏷️ ${receita.categoria ? receita.categoria.replace('_', ' ') : 'Geral'}`;
        document.getElementById('autor-receita').innerHTML = `👤 ${receita.autor || 'Chef Anónimo'}`;

        const imgFoto = document.getElementById('foto-receita');
        if (imgFoto) {
            imgFoto.src = receita.foto || 'assets/images/fundoinicial.png';
            imgFoto.alt = `Foto de ${receita.nome}`;
        }

        document.getElementById('ingredientes-receita').textContent = receita.ingredientes;
        document.getElementById('modo-preparo').textContent = receita.modo_preparo;

        renderizarAvaliacoes(receita.avaliacoes || []);
    })
    .catch(error => {
        console.error("Erro ao carregar detalhes da receita:", error);
        alert("Não foi possível carregar os detalhes desta receita.");
        window.location.href = 'index.html';
    });
}

function configurarFormularioAvaliacao(id) {
    const formAvaliacao = document.getElementById('form-avaliacao');

    if (formAvaliacao) {
        formAvaliacao.addEventListener('submit', (e) => {
            e.preventDefault();

            const notaSelect = document.getElementById('nota');
            const comentarioTextarea = document.getElementById('comentario');

            const dadosAvaliacao = {
                receitaId: parseInt(id),
                nota: parseInt(notaSelect.value),
                comentario: comentarioTextarea.value
            };

            fetch(`${API_BASE_URL}/detalhes?id=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosAvaliacao),
                credentials: 'include'
            })
            .then(response => {
                if (response.ok) {
                    alert("Avaliação publicada com sucesso!");
                    adicionarComentarioAoDOM(dadosAvaliacao.nota, dadosAvaliacao.comentario);
                    formAvaliacao.reset();
                } else if (response.status === 401) {
                    alert("Precisa de estar autenticado para enviar uma avaliação.");
                    window.location.href = 'login.html';
                } else {
                    alert("Avaliação registada localmente no ecrã!");
                    adicionarComentarioAoDOM(dadosAvaliacao.nota, dadosAvaliacao.comentario);
                    formAvaliacao.reset();
                }
            })
            .catch(error => {
                console.error("Erro ao processar envio:", error);

                adicionarComentarioAoDOM(dadosAvaliacao.nota, dadosAvaliacao.comentario);
                formAvaliacao.reset();
            });
        });
    }
}

function renderizarAvaliacoes(avaliacoes) {
    const listaContainer = document.getElementById('lista-comentarios');

    if (!listaContainer) return;

    if (avaliacoes.length === 0) {
        listaContainer.innerHTML = `
            <div class="comentario-card">
                <p>Nenhuma avaliação encontrada. Seja o primeiro a comentar!</p>
            </div>
        `;
        return;
    }

    listaContainer.innerHTML = '';
    avaliacoes.forEach(av => {
        const card = document.createElement('div');
        card.className = 'comentario-card';
        card.innerHTML = `
            <div class="comentario-header">
                <strong>${av.usuario || 'Utilizador'}</strong>
                <span>★ ${av.nota}/5</span>
            </div>
            <p>${av.comentario}</p>
        `;
        listaContainer.appendChild(card);
    });
}

function adicionarComentarioAoDOM(nota, texto) {
    const listaContainer = document.getElementById('lista-comentarios');
    if (!listaContainer) return;

    if (listaContainer.textContent.includes("Nenhuma avaliação encontrada")) {
        listaContainer.innerHTML = '';
    }

    const card = document.createElement('div');
    card.className = 'comentario-card';
    card.innerHTML = `
        <div class="comentario-header">
            <strong>Você</strong>
            <span>★ ${nota}/5</span>
        </div>
        <p>${texto}</p>
    `;

          const urlParams = new URLSearchParams(window.location.search);
          const receitaId = urlParams.get('id');

          if (!receitaId) {

              window.location.href = 'index.html';
              return;
          }

          carregarDetalhesReceita(receitaId);
          configurarFormularioAvaliacao(receitaId);
      });

      function carregarDetalhesReceita(id) {
          fetch(`${API_BASE_URL}/detalhes?id=${id}`, {
              method: 'GET',
              credentials: 'include'
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Receita não encontrada');
              }
              return response.json();
          })
          .then(receita => {
              document.getElementById('nome-receita').textContent = receita.nome;
              document.getElementById('tempo-receita').innerHTML = `⏱️ ${receita.tempo_preparo} min`;
              document.getElementById('rendimento-receita').innerHTML = `🍽️ ${receita.rendimento}`;
              document.getElementById('categoria-receita').innerHTML = `🏷️ ${receita.categoria ? receita.categoria.replace('_', ' ') : 'Geral'}`;
              document.getElementById('autor-receita').innerHTML = `👤 ${receita.autor || 'Chef Anónimo'}`;

              const imgFoto = document.getElementById('foto-receita');
              if (imgFoto) {
                  imgFoto.src = receita.foto || 'assets/images/fundoinicial.png';
                  imgFoto.alt = `Foto de ${receita.nome}`;
              }

              document.getElementById('ingredientes-receita').textContent = receita.ingredientes;
              document.getElementById('modo-preparo').textContent = receita.modo_preparo;

              renderizarAvaliacoes(receita.avaliacoes || []);
          })
          .catch(error => {
              console.error("Erro ao carregar detalhes da receita:", error);
              alert("Não foi possível carregar os detalhes desta receita.");
              window.location.href = 'index.html';
          });
      }

      function configurarFormularioAvaliacao(id) {
          const formAvaliacao = document.getElementById('form-avaliacao');

          if (formAvaliacao) {
              formAvaliacao.addEventListener('submit', (e) => {
                  e.preventDefault();

                  const notaSelect = document.getElementById('nota');
                  const comentarioTextarea = document.getElementById('comentario');

                  const dadosAvaliacao = {
                      receitaId: parseInt(id),
                      nota: parseInt(notaSelect.value),
                      comentario: comentarioTextarea.value
                  };

                  fetch(`${API_BASE_URL}/detalhes?id=${id}`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(dadosAvaliacao),
                      credentials: 'include'
                  })
                  .then(response => {
                      if (response.ok) {
                          alert("Avaliação publicada com sucesso!");
                          adicionarComentarioAoDOM(dadosAvaliacao.nota, dadosAvaliacao.comentario);
                          formAvaliacao.reset();
                      } else if (response.status === 401) {
                          alert("Precisa de estar autenticado para enviar uma avaliação.");
                          window.location.href = 'login.html';
                      } else {
                          alert("Avaliação registada localmente no ecrã!");
                          adicionarComentarioAoDOM(dadosAvaliacao.nota, dadosAvaliacao.comentario);
                          formAvaliacao.reset();
                      }
                  })
                  .catch(error => {
                      console.error("Erro ao processar envio:", error);
                      adicionarComentarioAoDOM(dadosAvaliacao.nota, dadosAvaliacao.comentario);
                      formAvaliacao.reset();
                  });
              });
          }
      }

      function renderizarAvaliacoes(avaliacoes) {
          const listaContainer = document.getElementById('lista-comentarios');

          if (!listaContainer) return;

          if (avaliacoes.length === 0) {
              listaContainer.innerHTML = `
                  <div class="comentario-card">
                      <p>Nenhuma avaliação encontrada. Seja o primeiro a comentar!</p>
                  </div>
              `;
              return;
          }

          listaContainer.innerHTML = '';
          avaliacoes.forEach(av => {
              const card = document.createElement('div');
              card.className = 'comentario-card';
              card.innerHTML = `
                  <div class="comentario-header">
                      <strong>${av.usuario || 'Utilizador'}</strong>
                      <span>★ ${av.nota}/5</span>
                  </div>
                  <p>${av.comentario}</p>
              `;
              listaContainer.appendChild(card);
          });
      }

      function adicionarComentarioAoDOM(nota, texto) {
          const listaContainer = document.getElementById('lista-comentarios');
          if (!listaContainer) return;

          if (listaContainer.textContent.includes("Nenhuma avaliação encontrada")) {
              listaContainer.innerHTML = '';
          }

          const card = document.createElement('div');
          card.className = 'comentario-card';
          card.innerHTML = `
              <div class="comentario-header">
                  <strong>Você</strong>
                  <span>★ ${nota}/5</span>
              </div>
              <p>${texto}</p>
          `;

