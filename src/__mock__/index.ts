export const miserbles = {
  nodes: [
    { id: 'Myriel', group: 1 },
    { id: 'Napoleon', group: 1 },
    { id: 'Mlle.Baptistine', group: 1 },
    { id: 'Mme.Magloire', group: 1 },
    { id: 'CountessdeLo', group: 1 },
    { id: 'Geborand', group: 1 },
    { id: 'Champtercier', group: 1 },
  ],
  links: [
    { source: 'Napoleon', target: 'Myriel', value: 1 },
    { source: 'Mlle.Baptistine', target: 'Myriel', value: 8 },
    { source: 'Mme.Magloire', target: 'Myriel', value: 10 },
    { source: 'Mme.Magloire', target: 'Mlle.Baptistine', value: 6 },
    { source: 'CountessdeLo', target: 'Myriel', value: 1 },
    { source: 'Geborand', target: 'Myriel', value: 1 },
    { source: 'Champtercier', target: 'Myriel', value: 1 },
  ],
};
