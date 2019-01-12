function Settings(props) {
    return (
      <Page>
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
  
  registerSettingsPage(Settings);