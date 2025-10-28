document.addEventListener("DOMContentLoaded", () => {
  // ===== Voltar com fallback =====
  const btnVoltar = document.getElementById("btnVoltar");
  if (btnVoltar) {
    btnVoltar.addEventListener("click", (e) => {
      e.preventDefault();

      const sameOriginRef = document.referrer && (() => {
        try { return new URL(document.referrer).origin === location.origin; }
        catch { return false; }
      })();

      if (sameOriginRef) {
        // Volta para a página anterior do mesmo domínio
        location.href = document.referrer;
        return;
      }

      if (history.length > 1) {
        history.back();
        return;
      }

      // Fallback explícito
      const fallback = btnVoltar.getAttribute("data-fallback") || "/";
      location.href = fallback;
    });
  }

  // ===== Filtro rápido =====
  const campoFiltro = document.getElementById("campoFiltro");
  const tabela = document.getElementById("tabelaLogs");
  const badgeQtd = document.getElementById("qtdRegistros");

  function atualizaBadge(qtdTotal, qtdVisiveis) {
    if (!badgeQtd) return;
    badgeQtd.textContent = qtdTotal === qtdVisiveis
      ? `${qtdTotal} registro(s)`
      : `${qtdVisiveis}/${qtdTotal} exibidos`;
  }

  if (campoFiltro && tabela) {
    const linhas = Array.from(tabela.querySelectorAll("tbody tr"));
    atualizaBadge(linhas.length, linhas.length);

    const filtra = () => {
      const termo = campoFiltro.value.trim().toLowerCase();
      let visiveis = 0;

      linhas.forEach(tr => {
        const texto = tr.innerText.toLowerCase();
        const ok = termo === "" || texto.includes(termo);
        tr.style.display = ok ? "" : "none";
        if (ok) visiveis++;
      });

      atualizaBadge(linhas.length, visiveis);
    };

    campoFiltro.addEventListener("input", filtra);
  }
});
