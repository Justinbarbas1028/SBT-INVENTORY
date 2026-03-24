import './bootstrap';

const THEME_STORAGE_KEY = 'sbt-inventory-theme';

const getJsonScript = (id) => {
    const element = document.getElementById(id);

    if (!element) {
        return null;
    }

    try {
        return JSON.parse(element.textContent ?? 'null');
    } catch {
        return null;
    }
};

const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    document.querySelectorAll('.theme-icon-light').forEach((element) => {
        element.classList.toggle('hidden', isDark);
    });

    document.querySelectorAll('.theme-icon-dark').forEach((element) => {
        element.classList.toggle('hidden', !isDark);
    });
};

const setupThemeToggle = () => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    applyTheme(currentTheme);

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        button.addEventListener('click', () => {
            const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    });
};

const setupSidebar = () => {
    const body = document.body;
    const backdrop = document.querySelector('[data-sidebar-backdrop]');

    document.querySelectorAll('[data-sidebar-open]').forEach((button) => {
        button.addEventListener('click', () => body.classList.add('sidebar-open'));
    });

    backdrop?.addEventListener('click', () => body.classList.remove('sidebar-open'));
};

const setupQuickActions = () => {
    const panel = document.querySelector('[data-fab-panel]');
    const toggle = document.querySelector('[data-fab-toggle]');

    if (!panel || !toggle) {
        return;
    }

    const openIcon = toggle.querySelector('.fab-icon-open');
    const closeIcon = toggle.querySelector('.fab-icon-close');

    const setOpen = (isOpen) => {
        panel.classList.toggle('hidden', !isOpen);
        openIcon?.classList.toggle('hidden', isOpen);
        closeIcon?.classList.toggle('hidden', !isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    setOpen(false);

    toggle.addEventListener('click', () => {
        setOpen(panel.classList.contains('hidden'));
    });

    document.addEventListener('click', (event) => {
        if (!panel.contains(event.target) && !toggle.contains(event.target)) {
            setOpen(false);
        }
    });
};

const setupPrintButtons = () => {
    document.querySelectorAll('[data-print-page]').forEach((button) => {
        button.addEventListener('click', () => window.print());
    });
};

const setupConfirmButtons = () => {
    document.querySelectorAll('[data-confirm]').forEach((button) => {
        button.addEventListener('click', (event) => {
            const message = button.getAttribute('data-confirm');

            if (message && !window.confirm(message)) {
                event.preventDefault();
            }
        });
    });
};

const setupSelectionToolbar = () => {
    const form = document.querySelector('[data-selection-form]');

    if (!form) {
        return;
    }

    const selectAll = form.querySelector('[data-select-all]');
    const checkboxes = () => Array.from(form.querySelectorAll('[data-select-item]'));
    const toolbar = document.querySelector('[data-selection-toolbar]');
    const countTarget = document.querySelector('[data-selected-count]');
    const exportButton = document.querySelector('[data-export-selected]');
    const exportForm = document.querySelector('[data-selected-export-form]');
    const exportInputs = document.querySelector('[data-selected-export-inputs]');

    const selectedIds = () =>
        checkboxes()
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);

    const sync = () => {
        const ids = selectedIds();
        const total = checkboxes().length;

        countTarget.textContent = String(ids.length);
        toolbar.classList.toggle('hidden', ids.length === 0);

        if (selectAll) {
            selectAll.checked = ids.length > 0 && ids.length === total;
        }
    };

    selectAll?.addEventListener('change', () => {
        checkboxes().forEach((checkbox) => {
            checkbox.checked = selectAll.checked;
        });
        sync();
    });

    checkboxes().forEach((checkbox) => checkbox.addEventListener('change', sync));

    exportButton?.addEventListener('click', () => {
        const ids = selectedIds();

        if (!ids.length || !exportForm || !exportInputs) {
            return;
        }

        exportInputs.innerHTML = '';
        ids.forEach((id) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'selected_ids[]';
            input.value = id;
            exportInputs.appendChild(input);
        });

        exportForm.submit();
    });

    sync();
};

const setupItemAutofill = () => {
    document.querySelectorAll('[data-item-autofill]').forEach((form) => {
        const mode = form.getAttribute('data-item-autofill');
        const lookup = getJsonScript(mode === 'check-in' ? 'check-in-lookup-data' : 'check-out-lookup-data') ?? [];
        const lookupMap = new Map(lookup.map((item) => [item.code, item]));
        const codeInput = form.querySelector('[data-item-code-input]');
        const foundTarget = form.querySelector('[data-item-found]');
        const nameInput = form.querySelector('[data-item-name-input]');
        const categoryInput = form.querySelector('[data-item-category-input]');

        if (!codeInput) {
            return;
        }

        const sync = () => {
            const code = codeInput.value.trim().toUpperCase();
            const item = lookupMap.get(code);

            if (!item) {
                if (foundTarget) {
                    foundTarget.classList.add('hidden');
                    foundTarget.textContent = '';
                }

                if (mode === 'check-in' && nameInput) {
                    nameInput.value = '';
                }

                return;
            }

            if (nameInput) {
                nameInput.value = item.name;
            }

            if (categoryInput) {
                categoryInput.value = item.category;
            }

            if (foundTarget) {
                foundTarget.textContent = mode === 'check-in'
                    ? `Found: ${item.name}`
                    : `Found: ${item.name} (${item.status})`;
                foundTarget.classList.remove('hidden');
            }
        };

        codeInput.addEventListener('input', sync);
        sync();
    });
};

const setupRegisterPreview = () => {
    const form = document.querySelector('[data-register-preview]');

    if (!form) {
        return;
    }

    const codeInput = form.querySelector('[data-register-code]');
    const nameInput = form.querySelector('[data-register-name]');
    const categoryInput = form.querySelector('[data-register-category]');

    const sync = () => {
        const code = (codeInput?.value || 'ITM-000').toUpperCase();
        const name = nameInput?.value || 'New Item';
        const category = categoryInput?.value || 'Other';
        const qr = `QR-${code}`;

        document.querySelectorAll('[data-register-preview-code], [data-register-preview-code-secondary]').forEach((element) => {
            element.textContent = code;
        });

        document.querySelectorAll('[data-register-preview-name]').forEach((element) => {
            element.textContent = name;
        });

        document.querySelectorAll('[data-register-preview-category]').forEach((element) => {
            element.textContent = category;
        });

        document.querySelectorAll('[data-register-preview-qr], [data-register-preview-qr-secondary]').forEach((element) => {
            element.textContent = qr;
        });
    };

    codeInput?.addEventListener('input', sync);
    nameInput?.addEventListener('input', sync);
    categoryInput?.addEventListener('change', sync);
    sync();
};

const refreshRepeaterButtons = (container) => {
    const itemsWrapper = container.querySelector('[data-repeater-items]');
    const rows = itemsWrapper ? Array.from(itemsWrapper.children) : [];
    rows.forEach((row, index) => {
        row.querySelectorAll('[data-repeater-remove]').forEach((button) => {
            button.disabled = rows.length === 1;
        });

        row.querySelectorAll('.metric-caption').forEach((caption) => {
            if (caption.textContent?.startsWith('Item ')) {
                caption.textContent = `Item ${index + 1}`;
            }
        });
    });
};

const setupRepeaters = () => {
    document.querySelectorAll('[data-repeater]').forEach((container) => {
        const key = container.getAttribute('data-repeater');
        const itemsWrapper = container.querySelector('[data-repeater-items]');
        const addButton = container.querySelector('[data-repeater-add]');
        const template = document.getElementById(key === 'logistics-items' ? 'logistics-repeater-template' : 'borrow-repeater-template');

        if (!itemsWrapper || !addButton || !template) {
            return;
        }

        let nextIndex = itemsWrapper.children.length;

        const bindRemoveButtons = () => {
            itemsWrapper.querySelectorAll('[data-repeater-remove]').forEach((button) => {
                button.onclick = () => {
                    if (itemsWrapper.children.length === 1) {
                        return;
                    }

                    button.closest('[data-repeater-item]')?.remove();
                    refreshRepeaterButtons(container);
                };
            });
        };

        addButton.addEventListener('click', () => {
            const markup = template.innerHTML
                .replaceAll('__INDEX__', String(nextIndex))
                .replaceAll('__NUMBER__', String(nextIndex + 1));

            const fragment = document.createRange().createContextualFragment(markup);
            itemsWrapper.appendChild(fragment);
            nextIndex += 1;
            bindRemoveButtons();
            refreshRepeaterButtons(container);
        });

        bindRemoveButtons();
        refreshRepeaterButtons(container);
    });
};

const setupBorrowReview = () => {
    document.querySelectorAll('[data-review-form]').forEach((form) => {
        form.querySelectorAll('[data-review-trigger]').forEach((button) => {
            button.addEventListener('click', () => {
                const decision = button.getAttribute('data-review-trigger');
                const code = form.getAttribute('data-request-code') || 'this request';
                const confirmed = window.confirm(`Are you sure you want to ${decision?.toLowerCase()} ${code}?`);

                if (!confirmed) {
                    return;
                }

                const promptLabel = decision === 'Approved'
                    ? `Optional approval note for ${code}:`
                    : `Optional rejection note for ${code}:`;

                const note = window.prompt(promptLabel, '') ?? '';
                form.querySelector('input[name="decision"]').value = decision;
                form.querySelector('input[name="review_note"]').value = note;
                form.submit();
            });
        });
    });
};

const setupLogisticsDefaults = () => {
    const defaults = getJsonScript('logistics-type-defaults');
    const typeSelect = document.querySelector('[data-logistics-type]');
    const originInput = document.querySelector('[data-logistics-origin]');
    const destinationInput = document.querySelector('[data-logistics-destination]');

    if (!defaults || !typeSelect || !originInput || !destinationInput) {
        return;
    }

    typeSelect.addEventListener('change', () => {
        const preset = defaults[typeSelect.value];

        if (!preset) {
            return;
        }

        originInput.value = preset.origin;
        destinationInput.value = preset.destination;
    });
};

document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupSidebar();
    setupQuickActions();
    setupPrintButtons();
    setupConfirmButtons();
    setupSelectionToolbar();
    setupItemAutofill();
    setupRegisterPreview();
    setupRepeaters();
    setupBorrowReview();
    setupLogisticsDefaults();
});
