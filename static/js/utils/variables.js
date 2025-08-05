export const url_data = `https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql`
export const auth = `https://learn.zone01oujda.ma/api/auth/signin`


export const USER = `
query {
    user {
        login
        firstName
        lastName
        campus
        email
    }
}
`

export const AUDIT = `
query {
  user {
    auditRatio
    audits_aggregate(where: {closureType: {_eq: succeeded}}) {
      aggregate {
        count
      }
    }
    failed_audits: audits_aggregate(where: {closureType: {_eq: failed}}) {
      aggregate {
        count
      }
    }
  }
}
`

export const TRANSACTIONS = `
query {
  transaction(
    where: {
      type: {_eq: "xp"},
      _or: [{object: {type: {_eq: "project"}}}, {object: {type: {_eq: "piscine"}}}]
    }
    order_by: {createdAt: asc}
  ) {
    amount
    object {
      name
    }
  }
} 
`

export const SKILLS = `
query getSkillTransactions($login: String!) {
  user(where: {login: {_eq: $login}}) {
    transactions(
      where: {
        type: {_ilike: "%skill%"}
      },
      order_by: {amount: desc}
    ) {
      type
      amount
    }
  }
}`












