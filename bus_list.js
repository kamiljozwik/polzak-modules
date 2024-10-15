function renderBuses(buses, page) {
  const container = document.getElementById("polzak-buses");

  if (!container) {
    console.error('Container element with id "polzak-buses" not found.');
    return;
  }

  container.innerHTML = "";

  const fragment = document.createDocumentFragment();

  const notes = {
    'root': "▼ Wybierz markę ▼",
    'brand': "▼ Wybierz model ▼",
    'model': "▼ Wybierz rocznik ▼",
  }

  Object.entries(buses).forEach(([brand, busList]) => {
    const section = document.createElement("section");

    const brands = Object.keys(window.buses).map((brand) =>
      brand.toLowerCase()
    );

    if (brands.includes(brand)) {
      const brandHead = document.createElement("div");
      brandHead.className =
        "mt-0 mb-6 flex justify-center w-full items-center gap-4";

      const brandName = document.createElement("h3");
      brandName.className =
        "text-center font-bold !text-4xl text-gray-700 uppercase !mb-0";
      brandName.textContent = brand;

      if (busList[0]?.parent) {
        brandName.textContent = `${brand} - ${busList[0]?.parent}`;
      }

      brandHead.appendChild(brandName);

      section.appendChild(brandHead);

      if (page !== 'root') {
        const chooseNote = document.createElement("p");
        chooseNote.className =
          "font-bold text-3xl text-gray-700 uppercase text-center";

        chooseNote.textContent = notes[page];
        section.appendChild(chooseNote);
      }
    }

    const ul = document.createElement("ul");
    ul.className =
      "flex flex-wrap w-full gap-8 sm:gap-4 my-6 !list-none !mb-12 !p-0";

    busList.forEach((bus) => {
      const li = document.createElement("li");
      const a = document.createElement("a");

      a.href = "/pl/c/" + bus.link;
      a.className = "inline-block w-full";

      li.className =
        "text-center md:text-left bg-gray-100 p-4 rounded shadow-md w-full sm:w-[calc(50%-2.5rem)] hover:shadow-lg transition";

      const img = document.createElement("img");
      img.src =
        bus.photoUrl ??
        `https://polzak.pl/upload/img/buses/${brand.toLowerCase()}_${bus.name.toLowerCase()}.webp`;
      img.alt = `${bus.name} photo`;
      img.className = "w-full h-[200px] object-contain object-center";

      const busName = document.createElement("h3");
      busName.textContent = bus.name;

      const busName_cls = ["font-bold", "text-xl", "mt-4"];
      busName.classList.add(...busName_cls);

      a.appendChild(img);
      a.appendChild(busName);

      li.appendChild(a);

      ul.appendChild(li);
    });

    section.appendChild(ul);
    fragment.appendChild(section);
  });

  if (page === 'root') {
    const rootChooseNote = document.createElement("p");
    rootChooseNote.className =
      "font-bold !mb-0 !mt-12 text-3xl text-gray-700 uppercase text-center";

    rootChooseNote.textContent = notes[page];

    container.appendChild(rootChooseNote);
  }

  container.appendChild(fragment);
}

function findObjectByLink(link) {
  const all = window.buses;
  const models = Object.values(all)?.flat();
  const model = models.find((bus) => bus.link === link);
  let brand = "";

  for (const property in all) {
    const brandData = all[property].find((bus) => bus.link === link);

    if (brandData) {
      brand = property;
      break;
    }
  }

  return model
    ? {
      [brand]: model.versions.map((v) => ({
        ...v,
        parent: model.name,
      })),
    }
    : {};
}

try {
  const userData = window.buses;
  const brands = Object.keys(userData).map((brand) => brand.toLowerCase());

  let buses = {};
  let page = 'root';

  // const brand = "fiat";
  const brand = window.location.pathname?.split("/")?.reverse()[1]?.toLowerCase() ?? "";

  // const model = "Doblo/259";
  const model = window.location.pathname?.split("/c/")?.reverse()[0] ?? "";

  const modelData = findObjectByLink(model);

  if (modelData) {
    buses = modelData;
    page = 'model'
  }

  if (brand && brands.includes(brand)) {
    buses = { [brand]: userData[brand] };
    page = 'brand'
  }

  if (window.location.pathname === "/") {
    buses = userData;
    page = 'root'
  }

  renderBuses(buses, page);
} catch (error) {
  console.error(error);
}
