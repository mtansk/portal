import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        p: (props) => (
            <p
                style={{
                    color: "#303030",
                    fontWeight: 400,
                    lineHeight: 1.1,
                    textAlign: "justify",
                }}
                {...props}
            />
        ),

        ul: (props) => (
            <ul
                style={{
                    listStyleType: "none",
                    paddingLeft: "2rem",
                }}
                {...props}
            />
        ),

        li: (props) => (
            <li
                style={{
                    position: "relative",
                    paddingLeft: "1.5rem",
                    color: "#303030",
                    fontWeight: 400,
                    lineHeight: 1.1,
                }}
                {...props}
            >
                <span
                    style={{
                        position: "absolute",
                        left: "0",
                        top: "0.5rem",
                        transform: "translateY(-50%)",
                    }}
                >
                    —
                </span>
                {props.children}
            </li>
        ),

        h1: (props) => (
            <h1
                style={{
                    lineHeight: 1.1,
                }}
                {...props}
            />
        ),
        h2: (props) => (
            <h2
                style={{
                    lineHeight: 1.1,
                }}
                {...props}
            />
        ),
        h3: (props) => (
            <h3
                style={{
                    lineHeight: 1.1,
                }}
                {...props}
            />
        ),
        a: (props) => (
            <a
                style={{
                    color: "#2351b3",
                    textDecoration: "none",
                    lineHeight: 1.1,
                    fontWeight: 450,
                }}
                {...props}
            />
        ),

        ...components,
    };
}
