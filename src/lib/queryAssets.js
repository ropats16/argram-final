import { prop, propEq, find, pluck, filter } from 'ramda';

export async function getAssetData() {
  let assets = []
  await fetch(`https://arweave.net/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: idQuery() })
  })
    .then(res => res.json())
    .then(({ data }) => Object.values(data.transactions))
    .then(edges => edges.map((node) => {
      node.map((sub) => {
        assets.push({
          id: sub.node?.id,
          image: `https://arweave.net/${sub.node?.id}`,
          title: sub.node.tags.find(t => t.name === 'Title')?.value,
          description: sub.node.tags.find(t => t.name === 'Description')?.value,
          type: sub.node.tags.find(t => t.name === 'Type')?.value,
          topics: pluck('value', filter(t => t.name.includes('Topic:'), sub.node.tags)),
          owner: prop('value', find(propEq('name', 'Creator'), sub.node.tags)) || sub.node.owner.address,
          timestamp: sub.node?.block?.timestamp || Date.now() / 1000
        });
      }
      )
    }))
  return assets
}

function idQuery() {
  return `
query {
  transactions(tags: [
      { name: "Contract-Src", values: ["Rx4qbEJuJ0kscCabQw9NQf3bo56C9nu2ce8z--GjViA"] }
    ]) {
    edges {
      node {
        id
        owner {
          address
        }
        tags {
          name
          value
        }
        block {
          timestamp
        }
      }
    }
  }
}
`
}
