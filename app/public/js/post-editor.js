function buildPostEditor() {
    const toolbar = document.createElement("div");
    const root = document.createElement("div");

    toolbar.classList = "btn-toolbar mb-1";
    toolbar.setAttribute("role", "toolbar");
    toolbar.innerHTML = `
        <button type="button" class="toolbar-btn btn btn-sm btn-light" data-action="bold">
            <i class="bi bi-type-bold"></i>
        </button>
        <button type="button" class="toolbar-btn btn btn-sm btn-light" data-action="italic">
            <i class="bi bi-type-italic"></i>
        </button>
        <button type="button" class="toolbar-btn btn btn-sm btn-light" data-action="link">
            <i class="bi bi-link-45deg"></i>
        </button>
        <button type="button" class="toolbar-btn btn btn-sm btn-light" data-action="list">
            <i class="bi bi-list-ul"></i>
        </button>
        <button type="button" class="toolbar-btn btn btn-sm btn-light" data-action="quote">
            <i class="bi bi-blockquote-left"></i>
        </button>
        <button type="button" class="toolbar-btn btn btn-sm btn-light" data-action="code">
            <i class="bi bi-code"></i>
        </button>
    `;

    root.innerHTML = `
        <textarea required class="form-control mb-2" name="message" style="min-height:120px;"></textarea>
    `;

    const textarea = root.querySelector("textarea");

    toolbar.addEventListener('click', (event) => {
        const btn = event.target.closest(".toolbar-btn");
        if(!btn) return;

        const action = btn.dataset.action;

        switch(action) {
            case "bold":
                wrapSelection(textarea, "**");     
                break;
            case "italic":
                wrapSelection(textarea, "*");
                break;
            case "link":
                wrapLink(textarea);
                break;
            case "list":
                prependSelection(textarea, "- ");
                break;
            case "quote":
                prependSelection(textarea, "> ");
                break;
            case "code":
                wrapCode(textarea);
            default:
                break;
        }
    });

    root.appendChild(toolbar);
    root.appendChild(textarea);

    return {
        root, toolbar, textarea 
    };
}

function prependSelection(textarea, symbol) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText = textarea.value.slice(start, end);

    const lineStart = textarea.value.lastIndexOf("\n", start - 1) + 1;

    if(textarea.value.slice(lineStart, start).includes(symbol)) {
        const symbolStart = lineStart + textarea.value.slice(lineStart).indexOf(symbol);
        const symbolEnd = symbolStart + symbol.length;

        const first = textarea.value.slice(0, symbolStart);
        const last = textarea.value.slice(symbolEnd);

        textarea.value = first + last;
        textarea.selectionStart -= symbol.length;
        textarea.selectionEnd -= symbol.length;

        textarea.focus();
    } else {
        const first = textarea.value.slice(0, start);
        const last = textarea.value.slice(end);

        textarea.value = first + symbol + selectedText + last;
        textarea.selectionStart = start + symbol.length;
        textarea.selectionEnd = end + symbol.length;

        textarea.focus();
    }
}

function wrapSelection(textarea, symbol) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText = textarea.value.slice(start, end);

    const first = textarea.value.slice(0, start);
    const last = textarea.value.slice(end);

    textarea.value = first + symbol + selectedText + symbol + last;

    textarea.selectionStart = start + symbol.length;
    textarea.selectionEnd = end + symbol.length;

    textarea.focus();
}

function wrapCode(textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText = textarea.value.slice(start, end);

    const first = textarea.value.slice(0, start);
    const last = textarea.value.slice(end);

    textarea.value = first + "```\n" + selectedText + "\n```" + last;

    textarea.selectionStart = start + 4;
    textarea.selectionEnd = end + 4;

    textarea.focus();
}

function wrapLink(textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const first = textarea.value.slice(0, start);
    const last = textarea.value.slice(end);

    if(start === end) {
        textarea.value = first + "[link text](url)" + last;
    } else {
        const selectedText = textarea.value.slice(start, end);
        textarea.value = first + "[link text]("+selectedText+")"+last;
    }

    textarea.selectionStart = start + 12;
    textarea.selectionEnd = end + 12;

    textarea.focus();
}