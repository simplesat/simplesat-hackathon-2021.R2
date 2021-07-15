import React from 'react'
import { Story } from '@storybook/react'

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

/**
 * @type {Story<React.ComponentPropsWithoutRef<typeof Button>>}
 */
const Template = (args) => <Button {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Basic = Template.bind({})
/** @type {Partial<{type:import('components/Button').ButtonType}>} */
Basic.args = {
  type: 'basic',
}

export const Primary = Template.bind({})
/** @type {Partial<{type:import('components/Button').ButtonType}>} */
Primary.args = {
  type: 'primary',
}

export const Disabled = Template.bind({})
/** @type {Partial<{type:import('components/Button').ButtonType}>} */
Disabled.args = {
  type: 'primary',
  disabled: true,
}
