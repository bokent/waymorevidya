import { Stepper, Title, TextInput, Group, Button, Progress, Space } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'

export function CreateGamePage() {
  const [activeStep, setActiveStep] = useState(0)
  const [progressValue, setProgressValue] = useState(0)
  const [isMigrating, setIsMigrating] = useState(false)

  useEffect(() => {
    const updateProgressBar = () => setProgressValue((prevValue) => prevValue + 10 * Math.random())
    if (isMigrating && progressValue < 100) {
      setTimeout(updateProgressBar, 1000)
    }
    if (progressValue >= 100) {
      setProgressValue(100)
      setIsMigrating(false)
    }
  }, [isMigrating, progressValue, setProgressValue])

  return (
    <Layout>
      <Title mb="xl">Game Onboarding Process</Title>
      <Stepper active={activeStep} onStepClick={setActiveStep} breakpoint="sm" mb="xl">
        {/* Step 1 */}
        <Stepper.Step label="Step 1" description="Verify Steam App ID">
          <Space h="xl" />
          <TextInput label="Waht is our Steam App ID?" />
        </Stepper.Step>
        {/* Step 2 */}
        <Stepper.Step label="Step 2" description="Import Game Assets">
          <Space h="xl" />
          {isMigrating && <Progress size="xl" animate value={progressValue} />}
          {!isMigrating && progressValue < 100 && (
            <Button onClick={() => setIsMigrating(true)}>Import assets from Steam</Button>
          )}
          {!isMigrating && progressValue >= 100 && (
            <Button variant="outline" component={Link} to="/games/63f6f59efc64c730ae39b37a/edit">
              Manage Game
            </Button>
          )}
        </Stepper.Step>
      </Stepper>

      <Group mt="xl">
        <Button disabled={activeStep <= 0} variant="default" onClick={() => setActiveStep(0)}>
          Back
        </Button>
        <Button disabled={activeStep >= 1} onClick={() => setActiveStep(1)}>
          Next step
        </Button>
      </Group>
    </Layout>
  )
}
