let page = 1;
      let nextUrl = "";
      let isLoading = false;
      const imageContainer = document.getElementById("image-container");
      const loadingIndicator = document.getElementById("loading-indicator");
      const fetchImages = async () => {
        if (isLoading) return;
        isLoading = true;
        loadingIndicator.style.display = "block";

        try {
          const response =
            page === 1
              ? await fetch(
                  `https://api.pexels.com/v1/search?query=curated?page=${page}&per_page=80`,
                  {
                    headers: {
                      Authorization:
                        "7AblmeHYi9JIHz2nYDUVVyZFAivqQztmDP9R3NVr5mweTEyD75WcdaZY",
                    },
                  }
                )
              : await fetch(nextUrl, {
                  headers: {
                    Authorization:
                      "7AblmeHYi9JIHz2nYDUVVyZFAivqQztmDP9R3NVr5mweTEyD75WcdaZY",
                  },
                });
          const data = await response.json();
          nextUrl = data.next_page;
          console.log(data);
          if (data.length === 0) return;
          data.photos.forEach((imageData) => {
            const imageCard = document.createElement("div");
            imageCard.classList.add("image-card");
            const img = document.createElement("img");
            img.src = imageData.src.portrait;
            img.classList.add("lazy-load");
            img.addEventListener("load", () => {
              img.classList.add("loaded");
            });
            const photographer = document.createElement("p");
            photographer.textContent = imageData.photographer;
            imageCard.appendChild(img);
            imageCard.appendChild(photographer);
            imageContainer.appendChild(imageCard);
          });

          page++;
        } catch (error) {
          console.error("Error fetching images:", error);
        } finally {
          console.log("finally");
          isLoading = false;
        }
        const observer = new IntersectionObserver((entries, observer) => {
          console.log("observer");
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log("entry 1");
              fetchImages();
              observer.unobserve(entry.target);
            }
          });
        }, {});
        const images = document.querySelectorAll(".image-card img");
        const lastImage = images[images.length - 1];
        console.log(lastImage);
        if (lastImage) {
          console.log("lastimage");
          observer.observe(lastImage);
          loadingIndicator.style.display = "none";
        }
      };
      fetchImages();