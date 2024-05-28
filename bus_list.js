function renderBuses(buses) {
  const container = document.getElementById("polzak-buses");

  if (!container) {
    console.error('Container element with id "polzak-buses" not found.');
    return;
  }

  container.innerHTML = "";

  const fragment = document.createDocumentFragment();

  Object.entries(buses).forEach(([brand, busList]) => {
    const section = document.createElement("section");

    const brands = Object.keys(window.buses).map((brand) =>
      brand.toLowerCase()
    );

    if (brands.includes(brand)) {
      const brandHead = document.createElement("div");
      brandHead.className =
        "mt-12 mb-6 flex justify-center w-full items-center gap-4";

      const logo = document.createElement("img");
      logo.src = `https://polzak.pl/upload/img/logo/${brand.toLowerCase()}.webp`;
      logo.alt = `brand`;
      logo.height = 100;
      logo.className = "h-[100px]";

      brandHead.appendChild(logo);

      if (busList[0]?.parent) {
        const parent = document.createElement("div");
        parent.className =
          "text-center font-bold text-2xl text-gray-700 uppercase";
        parent.textContent = busList[0]?.parent;
        brandHead.appendChild(parent);
      }

      section.appendChild(brandHead);
    }

    const ul = document.createElement("ul");
    ul.className =
      "flex flex-wrap w-full gap-8 sm:gap-4 my-6 !list-none !m-0 !p-0";

    busList.forEach((bus) => {
      const li = document.createElement("li");
      const a = document.createElement("a");

      a.href = "/pl/c/" + bus.link;
      a.className = "inline-block";

      li.className =
        "text-center md:text-left bg-gray-100 p-4 rounded shadow-md w-full sm:w-[calc(50%-2.5rem)] hover:shadow-lg transition";

      const img = document.createElement("img");
      img.src =
        bus.photoUrl ??
        `https://polzak.pl/upload/img/buses/${brand.toLowerCase()}_${bus.name.toLowerCase()}.webp`;
      img.alt = `${bus.name} photo`;
      img.className = "max-w-[400px] max-h-[300px]";

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

  const brand =
    window.location.pathname?.split("/")?.reverse()[1]?.toLowerCase() ?? "";

  const model = window.location.pathname?.split("/c/")?.reverse()[0] ?? "";

  const modelData = findObjectByLink(model);

  if (modelData) {
    buses = modelData;
  }

  if (brand && brands.includes(brand)) {
    buses = { [brand]: userData[brand] };
  }

  if (window.location.pathname === "/") {
    buses = userData;
  }

  renderBuses(buses);
} catch (error) {
  console.error(error);
}
