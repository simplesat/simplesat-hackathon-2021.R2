import Layout from 'components/Layout'

export default function Billing() {
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
            <span>524/1000</span>
          </div>
          <div className="h-2 relative max-w-xl rounded-full overflow-hidden mt-2">
            <div className="w-full h-full bg-gray-200 absolute"></div>
            <div className="h-full bg-green-500 absolute" style={{ width: '10%' }}></div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <span>Emails sent in this month</span>
            <span className="ml-auto">524/1000</span>
          </div>
          <div className="h-2 relative max-w-xl rounded-full overflow-hidden mt-2">
            <div className="w-full h-full bg-gray-200 absolute"></div>
            <div className="h-full bg-green-500 absolute" style={{ width: '10%' }}></div>
          </div>
        </div>
      </div>
      <hr className="my-8" />
      <h2 className="font-bold mb-5">Usage detail</h2>
      <UsageTable />
    </Layout>
  )
}

function UsageTable() {
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
          <tr className="hover:bg-grey-lighter">
            <td className="py-4 px-6 border-b border-grey-light">1/7/2021</td>
            <td className="py-4 px-6 border-b border-grey-light">5</td>
            <td className="py-4 px-6 border-b border-grey-light">1</td>
          </tr>
          <tr className="hover:bg-grey-lighter">
            <td className="py-4 px-6 border-b border-grey-light">2/7/2021</td>
            <td className="py-4 px-6 border-b border-grey-light">8</td>
            <td className="py-4 px-6 border-b border-grey-light">3</td>
          </tr>
          <tr className="hover:bg-grey-lighter">
            <td className="py-4 px-6 border-b border-grey-light">3/7/2021</td>
            <td className="py-4 px-6 border-b border-grey-light">7</td>
            <td className="py-4 px-6 border-b border-grey-light">2</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
