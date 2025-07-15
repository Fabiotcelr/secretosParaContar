import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, useLocation, useNavigate, Link, Outlet, Meta, Links, ScrollRestoration, Scripts } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useRef, useEffect } from "react";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    navigate("/");
  };
  return /* @__PURE__ */ jsx("nav", { className: "bg-white border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4", children: [
    /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center space-x-3 rtl:space-x-reverse", children: /* @__PURE__ */ jsx("img", { src: "/images/logoSpc.png", className: "h-10", alt: "Secretos para Contar Logo" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse", children: [
      /* @__PURE__ */ jsxs("div", { ref: dropdownRef, className: "relative", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "flex text-sm bg-gray-100 rounded-full md:me-0 focus:ring-4 focus:ring-orange dark:focus:ring-orange",
            id: "user-menu-button",
            "aria-expanded": isDropdownOpen,
            onClick: toggleDropdown,
            children: [
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Abrir menú de usuario" }),
              /* @__PURE__ */ jsx("img", { src: "/images/perfil.png", className: "h-10 w-10 rounded-full", alt: "Perfil" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `z-50 absolute right-0 mt-2 ${isDropdownOpen ? "block" : "hidden"} text-base list-none bg-white divide-y divide-lightGreen rounded-lg shadow-sm`,
            id: "user-dropdown",
            children: isLoggedIn ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsx("span", { className: "block text-sm text-darkBlue font-BeVietnamPro", children: "Bonnie Green" }),
                /* @__PURE__ */ jsx("span", { className: "block text-sm text-grayMedium truncate", children: "secretosParaContar.com" })
              ] }),
              /* @__PURE__ */ jsxs("ul", { className: "py-2", "aria-labelledby": "user-menu-button", children: [
                /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/perfil",
                    className: "block px-4 py-2 text-sm text-darkBlue hover:bg-lightGreen font-BeVietnamPro",
                    onClick: toggleDropdown,
                    children: "Mi Perfil"
                  }
                ) }),
                /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/historial",
                    className: "block px-4 py-2 text-sm text-darkBlue hover:bg-lightGreen font-BeVietnamPro",
                    onClick: toggleDropdown,
                    children: "Historial"
                  }
                ) }),
                /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/configuracion",
                    className: "block px-4 py-2 text-sm text-darkBlue hover:bg-lightGreen font-BeVietnamPro",
                    onClick: toggleDropdown,
                    children: "Configuración"
                  }
                ) }),
                /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "block w-full text-left px-4 py-2 text-sm text-orange hover:bg-lightGreen font-BeVietnamPro",
                    onClick: handleLogout,
                    children: "Cerrar Sesión"
                  }
                ) })
              ] })
            ] }) : /* @__PURE__ */ jsx("ul", { className: "py-2", "aria-labelledby": "user-menu-button", children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              Link,
              {
                to: "/login",
                className: "block px-4 py-2 text-sm text-darkBlue hover:bg-lightGreen font-BeVietnamPro",
                onClick: toggleDropdown,
                children: "Iniciar Sesión"
              }
            ) }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          "data-collapse-toggle": "navbar-user",
          type: "button",
          className: "inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-orange rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange",
          "aria-controls": "navbar-user",
          "aria-expanded": isMenuOpen,
          onClick: toggleMenu,
          children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Abrir menú principal" }),
            /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 17 14", children: /* @__PURE__ */ jsx("path", { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M1 1h15M1 7h15M1 13h15" }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `absolute top-0 left-0 w-full h-auto bg-white shadow-lg transition-transform transform ${isMenuOpen ? "translate-y-0 z-50" : "-translate-y-full"} md:relative md:translate-y-0 md:h-auto md:w-auto md:bg-transparent md:shadow-none`,
        id: "navbar-user",
        children: /* @__PURE__ */ jsxs("ul", { className: "flex flex-col font-BeVietnamPro p-4 md:p-0 mt-4 border border-lightGreen rounded-lg bg-lightBeige md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              className: `block py-2 px-3 rounded-sm md:p-0 font-BeVietnamPro ${location.pathname === "/" ? "text-orange" : "text-darkBlue hover:text-orange"}`,
              "aria-current": location.pathname === "/" ? "page" : void 0,
              onClick: () => setIsMenuOpen(false),
              children: "Inicio"
            }
          ) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            Link,
            {
              to: "/Biblioteca",
              className: `block py-2 px-3 rounded-sm md:p-0 font-BeVietnamPro ${location.pathname === "/Biblioteca" ? "text-orange" : "text-darkBlue hover:text-orange"}`,
              onClick: () => setIsMenuOpen(false),
              children: "Biblioteca"
            }
          ) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            Link,
            {
              to: "/Novedades",
              className: `block py-2 px-3 rounded-sm md:p-0 font-BeVietnamPro ${location.pathname === "/Novedades" ? "text-orange" : "text-darkBlue hover:text-orange"}`,
              onClick: () => setIsMenuOpen(false),
              children: "Novedades"
            }
          ) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            Link,
            {
              to: "/nosotros",
              className: `block py-2 px-3 rounded-sm md:p-0 font-BeVietnamPro ${location.pathname === "/nosotros" ? "text-orange" : "text-darkBlue hover:text-orange"}`,
              onClick: () => setIsMenuOpen(false),
              children: "Nosotros"
            }
          ) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            Link,
            {
              to: "/panel-administrativo",
              className: `block py-2 px-3 rounded-sm md:p-0 font-BeVietnamPro ${location.pathname === "/panel-administrativo" ? "text-orange" : "text-darkBlue hover:text-orange"}`,
              onClick: () => setIsMenuOpen(false),
              children: "Panel Administrativoo"
            }
          ) })
        ] })
      }
    )
  ] }) });
};
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.css"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Menu, {}),
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
function PanelAdministrativo() {
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-4", children: "Panel Administrativo" }),
    /* @__PURE__ */ jsx("p", { children: "Bienvenido a la página de Panel Administrativo." })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PanelAdministrativo
}, Symbol.toStringTag, { value: "Module" }));
function Biblioteca() {
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-4", children: "Biblioteca" }),
    /* @__PURE__ */ jsx("p", { children: "Bienvenido a la página de Biblioteca." })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Biblioteca
}, Symbol.toStringTag, { value: "Module" }));
function Novedades() {
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-4", children: "Novedades" }),
    /* @__PURE__ */ jsx("p", { children: "Bienvenido a la página de Novedades." })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Novedades
}, Symbol.toStringTag, { value: "Module" }));
function Nosotros() {
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-4", children: "Nosotros" }),
    /* @__PURE__ */ jsx("p", { children: "Bienvenido a la página de Nosotros." })
  ] });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Nosotros
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" }
  ];
};
function Index() {
  return /* @__PURE__ */ jsx("div", { className: "flex h-screen items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-16", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col items-center gap-9", children: [
      /* @__PURE__ */ jsxs("h1", { className: "leading text-2xl font-bold text-gray-800 dark:text-gray-100", children: [
        "Welcome to ",
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Remix" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "h-[144px] w-[434px]", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/logo-light.png",
            alt: "Remix",
            className: "block w-full dark:hidden"
          }
        ),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/logo-dark.png",
            alt: "Remix",
            className: "hidden w-full dark:block"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700", children: [
      /* @__PURE__ */ jsx("p", { className: "leading-6 text-gray-700 dark:text-gray-200", children: "What's next?" }),
      /* @__PURE__ */ jsx("ul", { children: resources.map(({ href, text, icon }) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        "a",
        {
          className: "group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500",
          href,
          target: "_blank",
          rel: "noreferrer",
          children: [
            icon,
            text
          ]
        }
      ) }, href)) })
    ] })
  ] }) });
}
const resources = [
  {
    href: "https://remix.run/start/quickstart",
    text: "Quick Start (5 min)",
    icon: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "20",
        viewBox: "0 0 20 20",
        fill: "none",
        className: "stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8.51851 12.0741L7.92592 18L15.6296 9.7037L11.4815 7.33333L12.0741 2L4.37036 10.2963L8.51851 12.0741Z",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    )
  },
  {
    href: "https://remix.run/start/tutorial",
    text: "Tutorial (30 min)",
    icon: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "20",
        viewBox: "0 0 20 20",
        fill: "none",
        className: "stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4.561 12.749L3.15503 14.1549M3.00811 8.99944H1.01978M3.15503 3.84489L4.561 5.2508M8.3107 1.70923L8.3107 3.69749M13.4655 3.84489L12.0595 5.2508M18.1868 17.0974L16.635 18.6491C16.4636 18.8205 16.1858 18.8205 16.0144 18.6491L13.568 16.2028C13.383 16.0178 13.0784 16.0347 12.915 16.239L11.2697 18.2956C11.047 18.5739 10.6029 18.4847 10.505 18.142L7.85215 8.85711C7.75756 8.52603 8.06365 8.21994 8.39472 8.31453L17.6796 10.9673C18.0223 11.0653 18.1115 11.5094 17.8332 11.7321L15.7766 13.3773C15.5723 13.5408 15.5554 13.8454 15.7404 14.0304L18.1868 16.4767C18.3582 16.6481 18.3582 16.926 18.1868 17.0974Z",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      }
    )
  },
  {
    href: "https://remix.run/docs",
    text: "Remix Docs",
    icon: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "20",
        viewBox: "0 0 20 20",
        fill: "none",
        className: "stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M9.99981 10.0751V9.99992M17.4688 17.4688C15.889 19.0485 11.2645 16.9853 7.13958 12.8604C3.01467 8.73546 0.951405 4.11091 2.53116 2.53116C4.11091 0.951405 8.73546 3.01467 12.8604 7.13958C16.9853 11.2645 19.0485 15.889 17.4688 17.4688ZM2.53132 17.4688C0.951566 15.8891 3.01483 11.2645 7.13974 7.13963C11.2647 3.01471 15.8892 0.951453 17.469 2.53121C19.0487 4.11096 16.9854 8.73551 12.8605 12.8604C8.73562 16.9853 4.11107 19.0486 2.53132 17.4688Z",
            strokeWidth: "1.5",
            strokeLinecap: "round"
          }
        )
      }
    )
  },
  {
    href: "https://rmx.as/discord",
    text: "Join Discord",
    icon: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "20",
        viewBox: "0 0 24 20",
        fill: "none",
        className: "stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M15.0686 1.25995L14.5477 1.17423L14.2913 1.63578C14.1754 1.84439 14.0545 2.08275 13.9422 2.31963C12.6461 2.16488 11.3406 2.16505 10.0445 2.32014C9.92822 2.08178 9.80478 1.84975 9.67412 1.62413L9.41449 1.17584L8.90333 1.25995C7.33547 1.51794 5.80717 1.99419 4.37748 2.66939L4.19 2.75793L4.07461 2.93019C1.23864 7.16437 0.46302 11.3053 0.838165 15.3924L0.868838 15.7266L1.13844 15.9264C2.81818 17.1714 4.68053 18.1233 6.68582 18.719L7.18892 18.8684L7.50166 18.4469C7.96179 17.8268 8.36504 17.1824 8.709 16.4944L8.71099 16.4904C10.8645 17.0471 13.128 17.0485 15.2821 16.4947C15.6261 17.1826 16.0293 17.8269 16.4892 18.4469L16.805 18.8725L17.3116 18.717C19.3056 18.105 21.1876 17.1751 22.8559 15.9238L23.1224 15.724L23.1528 15.3923C23.5873 10.6524 22.3579 6.53306 19.8947 2.90714L19.7759 2.73227L19.5833 2.64518C18.1437 1.99439 16.6386 1.51826 15.0686 1.25995ZM16.6074 10.7755L16.6074 10.7756C16.5934 11.6409 16.0212 12.1444 15.4783 12.1444C14.9297 12.1444 14.3493 11.6173 14.3493 10.7877C14.3493 9.94885 14.9378 9.41192 15.4783 9.41192C16.0471 9.41192 16.6209 9.93851 16.6074 10.7755ZM8.49373 12.1444C7.94513 12.1444 7.36471 11.6173 7.36471 10.7877C7.36471 9.94885 7.95323 9.41192 8.49373 9.41192C9.06038 9.41192 9.63892 9.93712 9.6417 10.7815C9.62517 11.6239 9.05462 12.1444 8.49373 12.1444Z",
            strokeWidth: "1.5"
          }
        )
      }
    )
  }
];
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DA5AjztU.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-Il0WJYdR.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-DorV1tfB.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-Il0WJYdR.js"], "css": ["/assets/root-C0KqdKfa.css"] }, "routes/panel-administrativo": { "id": "routes/panel-administrativo", "parentId": "root", "path": "panel-administrativo", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/panel-administrativo-DVQWfBvQ.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js"], "css": [] }, "routes/biblioteca": { "id": "routes/biblioteca", "parentId": "root", "path": "biblioteca", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/biblioteca-DuhdHIPy.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js"], "css": [] }, "routes/novedades": { "id": "routes/novedades", "parentId": "root", "path": "novedades", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/novedades-4T6LRKiz.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js"], "css": [] }, "routes/nosotros": { "id": "routes/nosotros", "parentId": "root", "path": "nosotros", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/nosotros-C0bjfH44.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-CWhSQhKm.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js"], "css": [] } }, "url": "/assets/manifest-566d9be5.js", "version": "566d9be5" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/panel-administrativo": {
    id: "routes/panel-administrativo",
    parentId: "root",
    path: "panel-administrativo",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/biblioteca": {
    id: "routes/biblioteca",
    parentId: "root",
    path: "biblioteca",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/novedades": {
    id: "routes/novedades",
    parentId: "root",
    path: "novedades",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/nosotros": {
    id: "routes/nosotros",
    parentId: "root",
    path: "nosotros",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route5
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
