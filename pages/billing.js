import Layout from 'components/Layout'
import { useQuery, gql } from '@apollo/client'

export default function Billing() {
  const { loading, error, data } = useQuery(GET_USAGES, {
    variables: {
      ownedBy: 'http://gateway:8000/api/account/company/1086/',
    },
  })
  if (loading) {
    return (
      <Layout>
        <h2 className="font-bold mb-5">Usage overview this month</h2>
        <Loader />
        <hr className="my-8" />
        <h2 className="font-bold mb-5">Usage detail</h2>
        <Loader />
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <h2 className="font-bold mb-5">Usage overview this month</h2>
        <ErrorMessage />
        <hr className="my-8" />
        <h2 className="font-bold mb-5">Usage detail</h2>
        <ErrorMessage />
      </Layout>
    )
  }

  const usages = toTableFormat(data['usage'])
  const feedbackReceived = calculateFeedbackReceived(usages)
  const feedbackReceivedUsedPercent = (feedbackReceived / 1000) * 100
  const emailSent = calculateEmailSent(usages)
  const emailSentUsedPercent = (emailSent / 1000) * 100

  return (
    <Layout>
      <h2 className="font-bold mb-5">Usage overview this month</h2>
      <div className="px-5 py-8 border border-gray-100 shadow-md flex flex-col w-1/2">
        <div className="flex">
          <span>Plan</span>
          <span className="ml-auto">Standard</span>
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs leading-none text-gray-800 bg-green-200 rounded ml-2">
            Active
          </span>
        </div>
        <div className="flex flex-col my-10">
          <div className="flex justify-between">
            <span>Feedback this month</span>
            <span>{feedbackReceived}/1000</span>
          </div>
          <div className="h-2 relative max-w-xl rounded-full overflow-hidden mt-2">
            <div className="w-full h-full bg-gray-200 absolute"></div>
            <div
              className="h-full bg-green-500 absolute"
              style={{ width: `${feedbackReceivedUsedPercent}%` }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <span>Emails sent in this month</span>
            <span className="ml-auto">{emailSent}/1000</span>
          </div>
          <div className="h-2 relative max-w-xl rounded-full overflow-hidden mt-2">
            <div className="w-full h-full bg-gray-200 absolute"></div>
            <div
              className="h-full bg-green-500 absolute"
              style={{ width: `${emailSentUsedPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
      <hr className="my-8" />
      <h2 className="font-bold mb-5">Usage detail</h2>
      <UsageTable usages={usages} />
    </Layout>
  )
}

function UsageTable({ usages }) {
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded my-6">
      <table className="text-left w-full border-collapse">
        <thead>
          <tr>
            <th className="py-4 px-6 bg-grey-lightest font-bold text-sm text-grey-dark border-b border-grey-light">
              Date
            </th>
            <th className="py-4 px-6 bg-grey-lightest font-bold text-sm text-grey-dark border-b border-grey-light">
              Send email
            </th>
            <th className="py-4 px-6 bg-grey-lightest font-bold text-sm text-grey-dark border-b border-grey-light">
              Feedback
            </th>
          </tr>
        </thead>
        <tbody>
          {usages.map((usage) => (
            <tr key={usage.date} className="hover:bg-grey-lighter">
              <td className="py-4 px-6 border-b border-grey-light">{usage.date}</td>
              <td className="py-4 px-6 border-b border-grey-light">{usage.send_email || 0}</td>
              <td className="py-4 px-6 border-b border-grey-light">
                {usage.receive_feedback || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Loader() {
  return (
    <div className="border border-green-300 shadow rounded-md p-4 max-w-sm w-1/2">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-green-400 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-green-400 rounded"></div>
            <div className="h-4 bg-green-400 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ErrorMessage() {
  return (
    <div className="alert flex flex-row items-center bg-red-200 p-5 rounded border-b-2 border-red-300">
      <div className="alert-icon flex items-center bg-red-100 border-2 border-red-500 justify-center h-10 w-10 flex-shrink-0 rounded-full">
        <span className="text-red-500">
          <svg fill="currentColor" viewBox="0 0 20 20" className="h-6 w-6">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </span>
      </div>
      <div className="alert-content ml-4">
        <div className="alert-title font-semibold text-lg text-red-800">Error</div>
        <div className="alert-description text-sm text-red-600">
          Oops! Something went wrong. Please try again.
        </div>
      </div>
    </div>
  )
}

function toTableFormat(usages) {
  const usagesTableFormat = {}
  usages.forEach((usage) => {
    if (usagesTableFormat[usage.date] === undefined) {
      usagesTableFormat[usage.date] = {}
    }
    usagesTableFormat[usage.date][usage.type] = usage.count
  })
  return Object.keys(usagesTableFormat).map((key) => ({ ...usagesTableFormat[key], date: key }))
}

function calculateFeedbackReceived(usages) {
  let feedbackReceived = 0
  usages.forEach((usage) => {
    if (usage['receive_feedback']) {
      feedbackReceived += usage['receive_feedback']
    }
  })

  return feedbackReceived
}

function calculateEmailSent(usages) {
  let emailSent = 0
  usages.forEach((usage) => {
    if (usage['send_email']) {
      emailSent += usage['send_email']
    }
  })

  return emailSent
}

const GET_USAGES = gql`
  query GetUsages($ownedBy: String) {
    usage(where: { owned_by: { _eq: $ownedBy } }, order_by: { date: desc }) {
      date
      type
      count
    }
  }
`
