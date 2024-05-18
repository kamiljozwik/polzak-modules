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

    const brandHead = document.createElement("div");
    brandHead.className = "mt-12 mb-6 flex justify-center w-full";

    const logo = document.createElement("img");
    logo.src = `https://polzak.pl/upload/img/logo/${brand.toLowerCase()}.webp`;
    logo.alt = `brand`;
    logo.height = 100;
    logo.className = "h-[100px]";

    brandHead.appendChild(logo);

    section.appendChild(brandHead);

    const ul = document.createElement("ul");
    ul.className = "flex flex-wrap gap-8 sm:gap-4 my-6 !list-none !m-0 !p-0";

    busList.forEach((bus) => {
      const li = document.createElement("li");
      const a = document.createElement("a");

      a.href = "/pl/c/" + bus.link;
      a.className = "inline-block";

      li.className =
        "text-center md:text-left bg-gray-100 md:p-6 rounded shadow-md w-full sm:w-[calc(50%-1rem)] hover:shadow-lg transition";

      const img = document.createElement("img");
      img.src =
        bus.photoUrl ??
        `https://polzak.pl/upload/img/buses/${brand.toLowerCase()}_${bus.name.toLowerCase()}.webp`;
      img.alt = `${bus.name} photo`;
      img.width = 400;

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

try {
  renderBuses(window.buses ?? []);
} catch (error) {
  console.error(error);
}
