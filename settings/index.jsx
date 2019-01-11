function HelloWorld(props) {
    return (
      <Page>
        <Section
          title={<Text bold align="center">Clock Settings</Text>}>
          <Toggle
            settingsKey="disconnect-warning"
            label="Disconnect Warning"
          />
        </Section>
      </Page>
    );
  }
  
  registerSettingsPage(HelloWorld);