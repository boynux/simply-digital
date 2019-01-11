function HelloWorld(props) {
    return (
      <Page>
        <Section
          title={<Text bold align="center">Clock Settings</Text>}>
          <Toggle
            settingsKey="12hours"
            label="12 Hours"
          />
        </Section>
        <Section
          title={<Text bold align="center">Other Settings</Text>}>
          <Toggle
            settingsKey="disconnect-warning"
            label="Disconnect Warning"
          />
        </Section>
      </Page>
    );
  }
  
  registerSettingsPage(HelloWorld);