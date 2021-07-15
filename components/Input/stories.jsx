import React from 'react'
import { Story } from '@storybook/react'

import Input from '.'

export default {
  title: 'Components/Input',
  component: Input,
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
  },
}

/**
 * @type {Story<React.ComponentPropsWithoutRef<typeof Input>>}
 */
const Template = (args) => <Input {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
}

export const Labeled = Template.bind({})
Labeled.args = {
  type: 'a',
  required: false,
  label: 'Email',
}
