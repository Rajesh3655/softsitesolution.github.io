const EMAIL_SERVICE_ID = "service_b9q299l";
const EMAIL_TEMPLATE_ID = "template_5qiv81p";
const EMAIL_PUBLIC_KEY = "k5ubOqKiKKdsPPOtL";
let toastTimeoutId = null;

document.addEventListener("DOMContentLoaded", () => {
    setupYear();
    setupHeader();
    setupMobileMenu();
    setupReveal();
    setupFaqs();
    setupProjectFilters();
    setupForms();
});

function setupYear() {
    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = String(new Date().getFullYear());
    });
}

function setupHeader() {
    const header = document.getElementById("navbar");
    if (!header) {
        return;
    }

    let ticking = false;
    const onScroll = () => {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(() => {
            header.classList.toggle("is-scrolled", window.scrollY > 10);
            ticking = false;
        });
    };

    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

function setupMobileMenu() {
    const button = document.querySelector("[data-menu-toggle]");
    const menu = document.getElementById("mobile-menu");
    if (!button || !menu) {
        return;
    }

    const setOpen = (open) => {
        button.setAttribute("aria-expanded", String(open));
        menu.classList.toggle("is-open", open);
        menu.hidden = !open;
    };

    setOpen(false);

    button.addEventListener("click", () => {
        setOpen(button.getAttribute("aria-expanded") !== "true");
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("click", (event) => {
        if (!menu.classList.contains("is-open")) {
            return;
        }

        const target = event.target;
        if (!(target instanceof Node)) {
            return;
        }

        if (!menu.contains(target) && !button.contains(target)) {
            setOpen(false);
        }
    });
}

function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    items.forEach((item) => observer.observe(item));
}

function setupFaqs() {
    document.querySelectorAll("[data-faq]").forEach((item, index) => {
        const button = item.querySelector(".faq-button");
        if (!button) {
            return;
        }

        const answer = item.querySelector(".faq-answer");
        if (!answer) {
            return;
        }

        const answerId = `faq-answer-${index + 1}`;
        answer.id = answerId;
        button.setAttribute("aria-controls", answerId);
        button.setAttribute("aria-expanded", "false");

        button.addEventListener("click", () => {
            const isOpen = item.classList.toggle("is-open");
            button.setAttribute("aria-expanded", String(isOpen));
        });
    });
}

function setupProjectFilters() {
    const buttons = document.querySelectorAll("[data-filter]");
    const cards = document.querySelectorAll("[data-project-category]");
    if (!buttons.length || !cards.length) {
        return;
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");

            buttons.forEach((node) => node.classList.toggle("is-active", node === button));
            cards.forEach((card) => {
                const category = card.getAttribute("data-project-category") || "";
                const show = filter === "all" || category.split(" ").includes(filter);
                card.classList.toggle("is-hidden", !show);
            });
        });
    });
}

function setupForms() {
    const forms = document.querySelectorAll("[data-contact-form]");
    if (!forms.length) {
        return;
    }

    initEmailJs();

    forms.forEach((form) => {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const submitButton = form.querySelector("[data-submit-button]");
            const originalText = submitButton?.textContent || "Send Inquiry";
            if (submitButton instanceof HTMLButtonElement) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            const pageSource = form.getAttribute("data-form-context") || document.title;
            const sourceField = form.querySelector('input[name="page_source"]');
            if (sourceField instanceof HTMLInputElement) {
                sourceField.value = pageSource;
            }

            try {
                initEmailJs();

                if (!window.emailjs || typeof window.emailjs.sendForm !== "function") {
                    throw new Error("Email service unavailable");
                }

                await window.emailjs.sendForm(
                    EMAIL_SERVICE_ID,
                    EMAIL_TEMPLATE_ID,
                    form,
                    EMAIL_PUBLIC_KEY
                );

                form.reset();
                showToast("Message sent successfully. We will get back to you soon.", "success");
            } catch (error) {
                console.error(error);
                showToast("Message failed to send. Please use WhatsApp or email directly.", "error");
            } finally {
                if (submitButton instanceof HTMLButtonElement) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
            }
        });
    });
}

function initEmailJs() {
    if (!window.emailjs || typeof window.emailjs.init !== "function") {
        return;
    }

    if (window.__softSiteEmailInit) {
        return;
    }

    window.emailjs.init(EMAIL_PUBLIC_KEY);
    window.__softSiteEmailInit = true;
}

function showToast(message, type = "info") {
    const toast = document.getElementById("toast");
    const messageNode = document.getElementById("toast-message");
    if (!toast || !messageNode) {
        return;
    }

    messageNode.textContent = message;
    toast.dataset.type = type;
    toast.hidden = false;
    toast.classList.add("is-visible");

    if (toastTimeoutId) {
        window.clearTimeout(toastTimeoutId);
    }

    const closeButton = toast.querySelector("[data-toast-close]");
    closeButton?.addEventListener(
        "click",
        () => {
            toast.classList.remove("is-visible");
            window.setTimeout(() => {
                toast.hidden = true;
            }, 220);
        },
        { once: true }
    );

    toastTimeoutId = window.setTimeout(() => {
        toast.classList.remove("is-visible");
        window.setTimeout(() => {
            toast.hidden = true;
        }, 220);
    }, 4200);
}
