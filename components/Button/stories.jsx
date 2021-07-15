import React from 'react'

import Button from '.'

export default {
  title: 'Components/Button',
  component: Button,
  args: {
    children: "I'm a button",
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

const Template = (args) => <Button {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Basic = Template.bind({})
Basic.args = {
  type: 'basic',
}

export const Primary = Template.bind({})
Primary.args = {
  type: 'primary',
}

export const Disabled = Template.bind({})
Disabled.args = {
  type: 'primary',
  disabled: true,
}
