import actions from "@/config/actions";
import getGPTResponse from "@/utils/getGPTResponse";

class AskAITool {
  constructor({ api }) {
    this.api = api;
    this.button = null;
    this.dropdown = null;
    this.range = null;
  }

  static get isInline() {
    return true;
  }

  static get title() {
    return "Ask AI";
  }

  createButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 20">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 16.5A2.493 2.493 0 0 1 6.51 18H6.5a2.468 2.468 0 0 1-2.4-3.154 2.98 2.98 0 0 1-.85-5.274 2.468 2.468 0 0 1 .921-3.182 2.477 2.477 0 0 1 1.875-3.344 2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 11 3.5m0 13v-13m0 13a2.492 2.492 0 0 0 4.49 1.5h.01a2.467 2.467 0 0 0 2.403-3.154 2.98 2.98 0 0 0 .847-5.274 2.468 2.468 0 0 0-.921-3.182 2.479 2.479 0 0 0-1.875-3.344A2.5 2.5 0 0 0 13.5 1 2.5 2.5 0 0 0 11 3.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M19 8.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185"/>
  </svg>`;

    button.style.cssText = "width: 13px; margin: 5px";
    return button;
  }

  createDropdown() {
    const dropdown = document.createElement("div");
    dropdown.classList.add("absolute", "hidden", "bg-white", "z-10");
    dropdown.style.cssText =
      "height: min-content; width: 220px; top: 100%; border: 1px solid #E8E8EB; margin-top: 5px; border-radius: 6px;";
    return dropdown;
  }

  createLabel() {
    const label = document.createElement("div");
    label.innerText = "Ask AI to:";
    label.style.cssText =
      "color: #707684; text-align:left; font-size: 11px; font-weight: 500; letter-spacing: .33px; padding: 10px 10px 5px; text-transform: uppercase;";
    return label;
  }

  createList() {
    const ul = document.createElement("ul");
    ul.classList.add("space-y-2");
    ul.innerHTML = actions
      .map(
        (action, index) => `
    <li class="px-4 py-2 cursor-pointer hover:bg-gray-200 flex justify-start items-center" key="${index}" data-action=${action.slug}>
      <div style="display: inline-flex; text-align: left; width: 26px; height: 26px; box-shadow: 0 0 0 1px #c9c9cc7a; border-radius: 5px; align-items: center; justify-content: center; background: #fff; box-sizing: content-box; flex-shrink: 0; margin-right: 10px;">
        ${action.icon}
      </div>
      <p style="text-align: left">${action.name}</p>
    </li>
  `
      )
      .join("");
    return ul;
  }

  attachDropdownToggle() {
    this.button.addEventListener("click", () => {
      this.dropdown.classList.toggle("hidden");
    });
  }

  attachListItemsEvent(ul) {
    ul.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", async (e) => {
        const listItem = e.target.closest("li");
        const action = listItem ? listItem.getAttribute("data-action") : null;
        if (this.range) {
          try {
            const response = await getGPTResponse(
              this.range.toString(),
              action
            );
            const textNode = document.createTextNode(response);
            this.range.deleteContents();
            this.range.insertNode(textNode);
          } catch (error) {
            console.error("An error occurred:", error);
          }
        }
      });
    });
  }

  render() {
    this.button = this.createButton();
    this.dropdown = this.createDropdown();
    const label = this.createLabel();
    const ul = this.createList();

    this.dropdown.appendChild(label);
    this.dropdown.appendChild(ul);
    this.button.appendChild(this.dropdown);

    this.attachDropdownToggle();
    this.attachListItemsEvent(ul);

    return this.button;
  }

  async surround(range) {
    this.range = range;
  }

  checkState(selection) {
    const state = {};
    state.enabled = true;
    return state;
  }
}

export default AskAITool;
