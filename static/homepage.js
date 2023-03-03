function template(data) {
    let tpl = document.querySelector("#tpl").content.cloneNode(true);
    tpl.querySelector(".cell-a").textContent = data[0];
    tpl.querySelector(".cell-b").textContent = data[1];
    tpl.querySelector(".cell-c").innerHTML = `<a href="http://${data[3]}" target="_blank">${data[2]}</a>`;
    tpl.querySelector(".value-wrapper").setAttribute("id", data[4]);
    return tpl;
}

let templateDict = {};
  
function toggleButton(button) {
    button.classList.toggle("active");
    if (button.classList.contains("active")) {
        fetch("/get_laws?id=" + button.id)
            .then(response => response.json())
            .then(data => {
                if (data !== null) {
                    // Create the HTML template for the values
                    let container = document.getElementById("values-container");
                    for (let i = 0; i < data.length; i++) {
                        let templateId = data[i][4];
                        if (!templateDict.hasOwnProperty(templateId)) {
                            impact = template(data[i]);
                            container.insertBefore(impact, container.firstChild);
                            templateDict[templateId] = [button.id];
                        } else if (!templateDict[templateId].includes(button.id)) {
                            templateDict[templateId].push(button.id);
                        }
                    }
                } else {
                    console.log("No values for column " + button.id);
                }
            })
            .catch(error => {
                console.error(error);
            });
        } else {
            for (let templateId in templateDict) {
                let buttonIds = templateDict[templateId];
                let index = buttonIds.indexOf(button.id);
                if (index !== -1) {
                  buttonIds.splice(index, 1);
                  if (buttonIds.length === 0) {
                    let template = document.getElementById(`${templateId}`);
                    console.log(template)
                    template.parentNode.removeChild(template);
                    delete templateDict[templateId];
                  }
                }
              }
    }
}

document.getElementById("reload-btn").addEventListener("click", function() {
    location.reload();
});