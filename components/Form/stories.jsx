import React from 'react'
import { Story } from '@storybook/react'

import Form from 'components/Form'

export default {
  title: 'Components/Form',
  component: Form,
  args: {
    disabled: false,
  },
  argTypes: {
    type: {
      options: ['basic', 'primary'],
    },
    onClick: {
      action: 'clicked',
    },
    onChangeInput: {
      action: 'clicked',
    },
  },
}

/**
 * @type {Story<import('react').ComponentPropsWithoutRef<typeof Form>&{onChangeInput: () => void}>}
 */
const Template = ({ onChangeInput, ...args }) => (
  <Form {...args}>
    <Form.Input required onChange={onChangeInput} />
    <Form.Input type="email" onChange={onChangeInput} />
  </Form>
)

export const Default = Template.bind({})
Default.args = {}

export const Disabled = Template.bind({})
Disabled.args = {}
