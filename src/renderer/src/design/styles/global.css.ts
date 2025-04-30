import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
@import url('https://cdn.jsdelivr.net/gh/fonts-archive/Paperlogy/Paperlogy.css');

  :root { font-size: 100%; }
  @media (max-width: 1440px) { :root { font-size: 90%; } }
  @media (max-width: 1024px) { :root { font-size: 80%; } }
  @media (max-width: 768px)  { :root { font-size: 70%; } }
  @media (max-width: 520px)  { :root { font-size: 60%; } }
  @media (max-width: 300px)  { :root { font-size: 50%; } }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  p {
    display: inline-block;
  }

  a {
    display: inline-block;
    text-decoration: none;
    color: inherit;
  }

  label {
    cursor: pointer;
  }

  input,
  textarea {
    user-select: auto;
    border: none;
    outline: none;
    resize: none;
  }

  input:focus {
    outline: none;
  }

  button {
    outline: none;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
  }
`

export default GlobalStyle
