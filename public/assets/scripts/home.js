if (document.getElementById("carousellugar")) {
  const carousel = document.getElementById("carousellugar");
  const cards = document.getElementById("alllugar");

  fetch("http://localhost:3000/lugares")
    .then(res => {
      console.log("Resposta bruta:", res);
      return res.json();
    })
    .then(lugares => {
      console.log("lugares recebidos:", lugares);

      // Destaques - Carrossel
      // Filtra os itens que têm a propriedade "destaque: true"
      // Esses serão os que aparecem no carrossel
      const destaques = lugares.filter(i => i.destaque);
      console.log("Destaques:", destaques);


      // Para cada lugar em destaque, adiciona um slide no carrossel
      destaques.forEach((lugar, i) => {
        carousel.innerHTML += `
          <div class="carousel-item ${i === 0 ? "active" : ""}">
            <img src="${lugar.image}" class="d-block w-100" alt="${lugar.title}">
            <div class="carousel-caption d-none d-md-block">
              <h5>${lugar.title}</h5>
              <p>${lugar.description}</p>
            </div>
          </div>
        `;
      });

      // Cards de destinos 
      // Para cada lugar (todos os destinos), cria um card com título, imagem e descrição
      lugares.forEach( lugar => {
        cards.innerHTML +=`
         <!-- coluna de 4 em cada linha no Bootstrap -->
          <div class="col-md-4 mb-4">

<!--Aqui eu redireciono para a página de detalhes do lugar ao clicar  passando o id do lugar-->
            <div class="card h-100" onclick="location.href='detalhe.html?id=${lugar.id}'" style="cursor:pointer;"> 
              <img src="${lugar.image}" class="card-img-top" alt="${lugar.title}">
              <div class="card-body"> 
                <h5 class="card-title">${lugar.title}</h5>
                <p class="card-text">${lugar.description}</p>
              </div>
            </div>
          </div>
        `;
      });
      // === GRÁFICOS COM CHART.JS ===

const estadoCount = {};
lugares.forEach(lugar => {
  const estado = (lugar.info.detalhe4 || "").replace(/estado:\"*/i, "").toUpperCase();

  if (estado) estadoCount[estado] = (estadoCount[estado] || 0) + 1;
});

const ctxBarra = document.getElementById("graficoBarras");
if (ctxBarra) {
  new Chart(ctxBarra, {
    type: 'bar',
    data: {
      labels: Object.keys(estadoCount),
      datasets: [{
        label: 'Lugares por estado',
        data: Object.values(estadoCount),
        backgroundColor: 'rgba(40, 167, 69, 0.7)'
      }]
    },
    options: { responsive: true }
  });
}

// === Gráfico de avaliações (pizza) ===

const avaliacoes = lugares.map(lugar => {
  const estrelas = (lugar.info.detalhe5 || "").match(/★/g);
  return estrelas ? estrelas.length : 0;
});

const ctxPizza = document.getElementById("graficoPizza");
if (ctxPizza) {
  new Chart(ctxPizza, {
    type: 'pie',
    data: {
      labels: lugares.map(l => l.title),
      datasets: [{
        label: 'Avaliação por lugar',
        data: avaliacoes,
        backgroundColor: [
          '#28a745', '#20c997', '#17a2b8', '#ffc107', '#dc3545', '#6f42c1', '#6610f2', '#fd7e14'
        ]
      }]
    },
    options: { responsive: true }
  });
}

// === MAPA COM MAPBOX ===
mapboxgl.accessToken = 'pk.eyJ1Ijoia2F1YWRpdyIsImEiOiJjbWJ5YzM3NGkwbTIyMnFwc2E4bzNqajRzIn0.jwuFRPWN62kqiXJdMoYFZA';
const map = new mapboxgl.Map({
  container: 'mapa',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-47.9292, -15.7801],
  zoom: 3.5
});

lugares.forEach(lugar => {
  const coordenadas = lugar.coordenadas;
  if (coordenadas && coordenadas.length === 2) {
    new mapboxgl.Marker()
      .setLngLat(coordenadas)
      .setPopup(new mapboxgl.Popup().setHTML(`<h6>${lugar.title}</h6><p>${lugar.description}</p>`))
      .addTo(map);
  }
});

    })
    .catch(error => {
      //caso ocorra algum erro durante a requisição, exibe no console
      console.error("Erro ao buscar os lugares:", error);
    });
    
}
/*===========PÁGINA DETALHES===========*/

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

fetch(`http://localhost:3000/lugares/${id}`)
  .then(res => res.json())
  .then(lugar => {
    // exibir os detalhes
    document.getElementById('titulo').innerText = lugar.title;
    document.getElementById('descricao').innerText = lugar.description;

    document.getElementById('detalhes').innerHTML = `
      <li>${lugar.info.detalhe1}</li>
      <li>${lugar.info.detalhe2}</li>
      <li>${lugar.info.detalhe3}</li>
      <li>${lugar.info.detalhe4}</li>
      <li>${lugar.info.detalhe5}</li>
    `;

    document.getElementById('galeria').innerHTML = lugar.gallery.map(img => `
      <img src="assets/img/${img}" class="img-thumbnail m-1" alt="Imagem da galeria">
    `).join('');
  });



/*============APLICAÇÃO DO CRUD CADASTRO DE LUGARES===========*/


 const apiUrl = 'http://localhost:3000/lugares';

        function displayMessage(msg) {
            alert(msg);
        }

        function carregarLugares() {
            fetch(apiUrl)
                .then(res => res.json())
                .then(lugares => {
                    const container = document.getElementById('lugar-container');
                    container.innerHTML = '';

                    lugares.forEach(lugar => {
                        const card = document.createElement('div');
                        card.className = 'col-md-4';
                        card.innerHTML = `
                            <div class="card p-3">
                                <img src="${lugar.image}" class="card-img-top" alt="Imagem">
                                <div class="card-body">
                                    <h5 class="card-title">${lugar.title}</h5>
                                    <p class="card-text">${lugar.description}</p>
                                    <ul>
                                        <li>${lugar.info.detalhe1}</li>
                                        <li>${lugar.info.detalhe2}</li>
                                        <li>${lugar.info.detalhe3}</li>
                                        <li>${lugar.info.detalhe4}</li>
                                        <li>${lugar.info.detalhe5}</li>
                                    </ul>
                                    <button class="btn btn-sm btn-success" onclick='editarLugar(${JSON.stringify(lugar)})'>Editar</button>
                                    <button class="btn btn-sm btn-danger" onclick='deletarLugar("${lugar.id}")'>Excluir</button>
                                </div>
                            </div>
                        `;
                        container.appendChild(card);
                    });
                });
        }

        document.getElementById('form-lugar').addEventListener('submit', function (e) {
            e.preventDefault();

            const lugar = {
                title: document.getElementById('title').value,
                image: document.getElementById('image').value,
                description: document.getElementById('description').value,
                info: {
                    detalhe1: document.getElementById('detalhe1').value,
                    detalhe2: document.getElementById('detalhe2').value,
                    detalhe3: document.getElementById('detalhe3').value,
                    detalhe4: document.getElementById('detalhe4').value,
                    detalhe5: document.getElementById('detalhe5').value
                },
                gallery: [
                    document.getElementById('gallery1').value,
                    document.getElementById('gallery2').value,
                    document.getElementById('gallery3').value,
                    document.getElementById('gallery4').value
                ],
                destaque: document.getElementById('destaque').checked, // true ou false
            
            coordenadas: [
                    parseFloat(document.getElementById('longitude').value),
                    parseFloat(document.getElementById('latitude').value)
],
};

            const id = document.getElementById('id').value;

            if (id) {
                // Atualiza lugar
                fetch(`${apiUrl}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(lugar)
                })
                    .then(() => {
                        displayMessage('Lugar atualizado com sucesso!');
                        carregarLugares();
                        document.getElementById('form-lugar').reset();
                    });
            } else {
                // Cria novo lugar
                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(lugar)
                })
                    .then(() => {
                        displayMessage('Lugar cadastrado com sucesso!');
                        carregarLugares();
                        document.getElementById('form-lugar').reset();
                    });
            }
        });

        function editarLugar(lugar) {
            document.getElementById('id').value = lugar.id;
            document.getElementById('title').value = lugar.title;
            document.getElementById('image').value = lugar.image;
            document.getElementById('description').value = lugar.description;
            document.getElementById('detalhe1').value = lugar.info.detalhe1;
            document.getElementById('detalhe2').value = lugar.info.detalhe2;
            document.getElementById('detalhe3').value = lugar.info.detalhe3;
            document.getElementById('detalhe4').value = lugar.info.detalhe4;
            document.getElementById('detalhe5').value = lugar.info.detalhe5;
            document.getElementById('gallery1').value = lugar.gallery[0];
            document.getElementById('gallery2').value = lugar.gallery[1];
            document.getElementById('gallery3').value = lugar.gallery[2];
            document.getElementById('gallery4').value = lugar.gallery[3];
            document.getElementById('latitude').value = lugar.coordenadas[1];
            document.getElementById('longitude').value = lugar.coordenadas[0];

        }

        function deletarLugar(id) {
            fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            })
                .then(() => {
                    displayMessage('Lugar excluído com sucesso!');
                    carregarLugares();
                });
        }

        carregarLugares();



