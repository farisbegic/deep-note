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
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-5 h-">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
</svg>
`;
    button.classList.add(
      "flex",
      "items-center",
      "padding-[6px]",
      "relative",
      "text-violet-600"
    );
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
    <li class="px-4 py-2 cursor-pointer hover:bg-gray-200 flex items-center" key="${index}" data-action=${action.slug}>
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
