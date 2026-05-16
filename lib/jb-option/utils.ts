export function removeCheckboxNodes(nodes: Node[]) {
  const isChk = (n: Node) =>
    n.nodeType === 1 &&
    ((n instanceof HTMLInputElement && n.type === 'checkbox') ||
      (n as Element).tagName.toLowerCase() === 'jb-checkbox');

  const walk = (n: Node, index:number) => {
    // Array.from(n.childNodes).forEach(walk);
    if (!isChk(n)) return;
    if (n.childNodes.length) {
      const fragmentElement =  document.createDocumentFragment();
      fragmentElement.append(...n.childNodes);
      (n as Element).replaceWith(fragmentElement);
      nodes[index] = fragmentElement
      
    } else {
      (n as Element).remove();
      nodes.splice(index,1)
    }
  };
  nodes.forEach(walk);
}