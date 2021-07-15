import React from 'react'
import { Story } from '@storybook/react'

import TicketInput from '.'

export default {
  title: 'Components/TicketInput',
  component: TicketInput,
  argTypes: {
    onChange: {
      action: 'changed',
    },
  },
}

/**
 * @type {Story<React.ComponentPropsWithoutRef<typeof TicketInput>>}
 */
const Template = (args) => <TicketInput {...args} />

export const Default = Template.bind({})
Default.args = {}
