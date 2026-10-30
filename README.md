# Almeida & Vasconcelos — site institucional

Site de uma página (one-page) para escritório de advocacia, construído em HTML, CSS e
JavaScript puros — sem build, sem dependências e sem frameworks.

## Como visualizar

Abra o arquivo `index.html` no navegador. Para servir localmente (opcional):

```powershell
# na pasta do projeto
npx serve .        # ou: python -m http.server 8000
```

## Estrutura

```
site-advocacia/
├── index.html          # conteúdo e estrutura de todas as seções
├── styles.css          # identidade visual, layout e responsividade
├── script.js           # menu, animações, slider, FAQ e formulário
└── assets/
    └── favicon.svg     # marca em SVG
```

## Seções

1. **Hero** — posicionamento, chamada para ação e prova de credibilidade
2. **Faixa de áreas** — marquee discreto com as especialidades
3. **Áreas de atuação** — 6 cards com ícones e descrições
4. **O escritório** — história, método e diferenciais
5. **Números** — contadores animados ao entrar na tela
6. **Equipe** — sócios e advogado sênior (monogramas em vez de fotos)
7. **Método** — 4 etapas do atendimento
8. **Depoimentos** — slider com navegação, dots, swipe e autoplay
9. **Dúvidas frequentes** — accordion acessível
10. **Contato** — formulário validado + dados do escritório
11. **Rodapé** — navegação, contato e aviso legal da OAB
12. **Política de Privacidade** — modal (`<dialog>`) com texto LGPD

## Recursos técnicos

- Layout responsivo (desktop, tablet e celular) com menu mobile acessível
- Header que muda de aparência ao rolar; link ativo conforme a seção visível
- Animações de entrada com `IntersectionObserver` e respeito a `prefers-reduced-motion`
- Formulário com validação em tempo real, máscara de telefone e mensagem de sucesso
- SEO básico: metadados, Open Graph e dados estruturados `LegalService` (JSON-LD)
- Foco visível, rótulos de formulário, `aria-expanded` e navegação por teclado
- Sem requisições externas além das fontes do Google (Cormorant Garamond + Inter)

## Personalização rápida

| O que mudar | Onde |
| --- | --- |
| Nome, OAB, endereço, telefone, e-mail | `index.html` (busque por "Almeida") |
| Cores e tipografia | `styles.css` — bloco `:root` (variáveis no topo) |
| Áreas de atuação | `index.html`, seção `#areas` |
| Equipe e depoimentos | `index.html`, seções `#equipe` e `.testimonials` |
| Envio real do formulário | `script.js`, bloco `/* Simulação de envio ... */` |

### Cores principais

- `--ink: #0b141d` — azul-petróleo profundo
- `--paper: #f7f4ee` — marfim
- `--gold: #b08e52` — dourado (elementos de destaque)
- `--gold-ink: #8a6b37` — dourado escuro para textos pequenos sobre fundo claro
- `--serif: Cormorant Garamond` / `--sans: Inter`

## Antes de publicar

- [ ] Substituir dados fictícios: OAB/SP 12.345, endereço, telefones, e-mails, nomes e bios
- [ ] Inserir fotos reais da equipe (os monogramas são placeholders)
- [ ] Revisar os depoimentos e obter autorização de uso
- [ ] Conectar o formulário a um serviço real (e-mail, CRM ou API) e remover a simulação
- [ ] Ajustar a Política de Privacidade e o encarregado de dados (DPO)
- [ ] Revisar o texto conforme o Código de Ética e Disciplina da OAB
      (sem promessa de resultado, captação de clientela ou mercantilização da advocacia)
- [ ] Trocar a URL de exemplo no JSON-LD e adicionar imagem Open Graph
- [ ] Configurar HTTPS, domínio e certificado

## Compatibilidade

Navegadores modernos (Chrome, Edge, Firefox e Safari recentes). O formulário e as animações
funcionam sem bibliotecas; em navegadores muito antigos a página continua legível graças ao
fallback de `noscript`.

---

Conteúdo e dados deste projeto são fictícios, criados para demonstração de layout.
